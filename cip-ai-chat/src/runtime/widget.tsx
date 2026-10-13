import { React, AllWidgetProps, DataSourceManager } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';

export default function Widget(props: AllWidgetProps<any>) {
  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null);
  const [prompt, setPrompt] = React.useState('');
  const [restrictExtent, setRestrictExtent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [aiData, setAiData] = React.useState<any>(null);

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const getPavementLayers = (): __esri.FeatureLayer[] => {
    if (!jimuMapView?.view?.map) return [];
    return jimuMapView.view.map.allLayers
      .filter((l: any) => {
        const title = (l.title || '').toLowerCase();
        const id = (l.id || '').toLowerCase();
        return title.includes('pavement') || id.includes('pavement');
      })
      .toArray() as __esri.FeatureLayer[];
  };

  const getTargetDataSource = () => {
    const dsManager = DataSourceManager.getInstance();
    const dsConfig = props.useDataSources?.[0];

    if (dsConfig?.dataSourceId) {
      const ds = dsManager.getDataSource(dsConfig.dataSourceId);
      if (ds) return ds.getMainDataSource ? ds.getMainDataSource() : ds;
    }

    const allDataSources = dsManager.getDataSources();
    for (const ds of Object.values(allDataSources) as any[]) {
      const label = ds.getLabel() || '';
      if (label.includes('Master Pavement') || ds.id?.includes('Master_Pavement') || label.toLowerCase().includes('pavement')) {
        return ds.getMainDataSource ? ds.getMainDataSource() : ds;
      }
    }
    return null;
  };

  const syncDataSourcesAndMap = async (sqlWhere: string) => {
    const targetWhere = sqlWhere && sqlWhere.trim() && sqlWhere !== '1=1' ? sqlWhere : '';

    const pavementLayers = getPavementLayers();
    for (const layer of pavementLayers) {
      try {
        await layer.when();
        layer.definitionExpression = targetWhere;
        layer.refresh();
      } catch (err) {
        console.warn(`Definition expression error on layer ${layer.title}:`, err);
      }
    }

    const mainDS = getTargetDataSource();
    if (mainDS) {
      try {
        if (typeof (mainDS as any).clearSelection === 'function') {
          (mainDS as any).clearSelection();
        }

        if (typeof (mainDS as any).setDefinitionExpression === 'function') {
          (mainDS as any).setDefinitionExpression(targetWhere);
        }

        if (typeof (mainDS as any).setQueryParams === 'function') {
          (mainDS as any).setQueryParams({ where: targetWhere || '1=1' }, props.id);
        }

        if (typeof (mainDS as any).getDataViews === 'function') {
          const views = (mainDS as any).getDataViews();
          if (views) {
            Object.values(views).forEach((v: any) => {
              if (v) {
                if (typeof v.setDefinitionExpression === 'function') {
                  v.setDefinitionExpression(targetWhere);
                }
                if (typeof v.setQueryParams === 'function') {
                  v.setQueryParams({ where: targetWhere || '1=1' }, props.id);
                }
                if (typeof v.addSourceVersion === 'function') {
                  v.addSourceVersion();
                }
              }
            });
          }
        }

        if (typeof (mainDS as any).addSourceVersion === 'function') {
          (mainDS as any).addSourceVersion();
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (e) {
        console.warn('DataSource sync notice:', e);
      }
    }
  };

  const handleResetMap = async () => {
    if (!jimuMapView) return;
    setStatus('Resetting map & restoring all layers...');
    setAiData(null);
    setPrompt('');

    try {
      await syncDataSourcesAndMap('');
      setStatus('Map reset. All assets visible.');
    } catch (err) {
      console.error('Error resetting map:', err);
      setStatus('Error resetting layers.');
    }
  };

  // 1. CSV EXPORT FOR COMPOUND & INVENTORY FILTERS
  const handleExportFilterCSV = () => {
    if (!aiData?.filterBreakdown || aiData.filterBreakdown.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '"MUNICIPAL ASSET MANAGEMENT - SCHEDULE & DEPRECIATION RISK ASSESSMENT"\n';
    csvContent += `"Generated Date","${new Date().toLocaleDateString()}"\n\n`;
    csvContent += 'Scheduled Treatment Year,Street Name,Length (ft),Current RSR,Projected RSR,Depreciating Year,Scheduled Cost (CIP_TotalCost),Projected Depreciating Cost,Cost Penalty Jump\n';

    let grandScheduledCost = 0;
    let grandProjectedCost = 0;
    let grandJump = 0;

    aiData.filterBreakdown.forEach((yearGroup: any) => {
      const segs = yearGroup.segments || [];
      let yearSched = 0;
      let yearProj = 0;
      let yearJump = 0;

      segs.forEach((seg: any) => {
        const sCost = seg.currentCost || 0;
        const pCost = seg.projectedCost || 0;
        const jump = seg.costJump || 0;

        yearSched += sCost;
        yearProj += pCost;
        yearJump += jump;

        const row = [
          `"${yearGroup.year}"`,
          `"${seg.street || 'Unknown Street'}"`,
          seg.length || 0,
          seg.currentRsr || '',
          seg.projectedRsr || '',
          `"${seg.depreciatingYear || 'N/A'}"`,
          sCost,
          pCost,
          jump
        ].join(',');
        csvContent += row + '\n';
      });

      grandScheduledCost += yearSched;
      grandProjectedCost += yearProj;
      grandJump += yearJump;

      csvContent += `"${yearGroup.year} SUBTOTAL","--","--","--","--","--","${yearSched.toFixed(2)}","${yearProj.toFixed(2)}","${yearJump.toFixed(2)}"\n`;
      csvContent += ',\n';
    });

    csvContent += `\n"GRAND TOTALS","--","--","--","--","--","${grandScheduledCost.toFixed(2)}","${grandProjectedCost.toFixed(2)}","${grandJump.toFixed(2)}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Schedule_And_Depreciation_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus('Compound report CSV exported.');
  };

  // 2. CSV EXPORT FOR CIP RECOMMENDED SCHEDULE
  const handleExportCIPScheduleCSV = () => {
    if (!aiData?.cipAllocations || aiData.cipAllocations.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '"MUNICIPAL CAPITAL IMPROVEMENT PLAN - RECOMMENDED ROADWAY TREATMENTS"\n';
    csvContent += `"Generated Date","${new Date().toLocaleDateString()}"\n\n`;
    csvContent += 'Treatment Year,Street Name,CBV Score,Allocated Cost\n';

    aiData.cipAllocations.forEach((yearGroup: any) => {
      const streets = yearGroup.streets || [];
      let yearlySum = 0;

      streets.forEach((st: any) => {
        const cost = st.cost || 0;
        yearlySum += cost;

        const row = [
          `"${yearGroup.year}"`,
          `"${st.street || st.streetName || 'Unknown Street'}"`,
          st.cbv || 0,
          cost
        ].join(',');
        csvContent += row + '\n';
      });

      csvContent += `"${yearGroup.year} TOTAL SPEND","--","--","${yearlySum}"\n`;
      csvContent += `"${yearGroup.year} BUDGET CAP","--","--","${yearGroup.budget || yearlySum}"\n`;
      csvContent += ',\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Recommended_CIP_Schedule_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus('CIP schedule exported.');
  };

  // 3. CSV EXPORT FOR DEPRECIATION RISK
  const handleExportDepreciationCSV = () => {
    if (!aiData?.depreciationBreakdown || aiData.depreciationBreakdown.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '"MUNICIPAL ASSET MANAGEMENT - DEPRECIATION RISK & COST OF DELAY REPORT"\n';
    csvContent += `"Generated Date","${new Date().toLocaleDateString()}"\n\n`;
    csvContent += 'Projection Year,Street Name,Mean Current RSR,Projected RSR,Current Category,Future Category,Total Square Yards,Current Total Cost,Future Total Cost,Repair Cost Jump\n';

    aiData.depreciationBreakdown.forEach((yearGroup: any) => {
      const crossings = yearGroup.crossings || yearGroup.streets || yearGroup.atRiskSegments || [];
      let yearlySum = 0;

      crossings.forEach((st: any) => {
        const costJump = st.repairCostJump || 0;
        yearlySum += costJump;

        const row = [
          `"${yearGroup.year}"`,
          `"${st.street || st.streetName || 'Unknown'}"`,
          st.meanCurrentRsr || '',
          st.projectedRsr || '',
          `"${st.currentCategory || ''}"`,
          `"${st.futureCategory || ''}"`,
          st.totalSquareYards || '',
          st.currentTotalCost || '',
          st.futureTotalCost || '',
          costJump
        ].join(',');
        csvContent += row + '\n';
      });

      csvContent += `"${yearGroup.year} SUBTOTAL","--","--","--","--","--","--","--","--","${yearlySum}"\n`;
      csvContent += ',\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Executive_Depreciation_Risk_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus('Depreciation report exported.');
  };

  const handleRunScenario = async (promptOverride?: string) => {
    const queryPrompt = promptOverride || prompt;

    if (!jimuMapView) {
      setStatus('Map connecting...');
      return;
    }

    if (!queryPrompt.trim()) {
      setStatus('Please enter a scenario prompt.');
      return;
    }

    setLoading(true);
    setStatus('Analyzing spatial model...');
    setAiData(null);

    try {
      const pavementLayers = getPavementLayers();
      for (const layer of pavementLayers) {
        await layer.when();
      }

      let payloadExtent = null;
      if (restrictExtent && jimuMapView.view?.extent) {
        const extent = jimuMapView.view.extent;
        payloadExtent = {
          xmin: extent.xmin,
          ymin: extent.ymin,
          xmax: extent.xmax,
          ymax: extent.ymax,
          wkid: extent.spatialReference?.wkid || 3857
        };
      }

      const response = await fetch('https://t45ss7vdf8.execute-api.us-east-2.amazonaws.com/default/AI_Experience_Builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryPrompt, extent: payloadExtent })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setAiData(data);

      const qType = (data.queryType || '').toLowerCase();
      let sqlWhere = data.whereClause || data.where || data.sqlWhere || '';

      if (sqlWhere) {
        sqlWhere = sqlWhere.replace(/STREET_NAME/gi, 'StreetName');
      }

      if (!sqlWhere || sqlWhere.trim() === '' || sqlWhere === '1=1') {
        if (data.depreciationBreakdown && Array.isArray(data.depreciationBreakdown) && data.depreciationBreakdown.length > 0) {
          const rawStreets: string[] = [];
          data.depreciationBreakdown.forEach((yr: any) => {
            const list = yr.crossings || yr.streets || yr.atRiskSegments || yr.data || [];
            list.forEach((st: any) => {
              if (typeof st === 'string') rawStreets.push(st);
              else if (st?.street) rawStreets.push(st.street);
              else if (st?.streetName) rawStreets.push(st.streetName);
              else if (st?.STREET_NAME) rawStreets.push(st.STREET_NAME);
            });
          });

          const uniqueStreets = Array.from(new Set(rawStreets.filter(Boolean)));
          if (uniqueStreets.length > 0) {
            const formatted = uniqueStreets.map(s => `'${s.trim().replace(/'/g, "''")}'`).join(',');
            sqlWhere = `StreetName IN (${formatted})`;
          }
        }
      }

      let effectiveWhere = '';
      if (qType !== 'analytical_query') {
        if (sqlWhere && sqlWhere.trim() && sqlWhere !== '1=1') {
          effectiveWhere = sqlWhere;
        } else if (data.matchedOids && Array.isArray(data.matchedOids) && data.matchedOids.length > 0) {
          // Guaranteed fallback: locks map canvas strictly to returned assets
          effectiveWhere = `OBJECTID IN (${data.matchedOids.join(',')})`;
        }
      }

      await syncDataSourcesAndMap(effectiveWhere);

      let totalSegments = data.featureCount || 0;
      if (qType === 'depreciation_risk' && data.depreciationBreakdown && data.depreciationBreakdown.length > 0) {
        totalSegments = data.depreciationBreakdown.reduce(
          (acc: number, yr: any) => acc + (yr.crossings?.length || yr.streets?.length || 0), 0
        );
      }

      if (qType === 'cip_optimization') {
        setStatus(`CIP Schedule Active: ${totalSegments} segments allocated`);
      } else if (qType === 'simple_filter') {
        setStatus(`Filter Active: ${totalSegments} segments matched`);
      } else if (qType === 'depreciation_risk' || qType.includes('depreciation')) {
        setStatus(`Tipping Point Analysis: ${totalSegments} streets flagged`);
      } else if (qType === 'analytical_query') {
        setStatus('Analytical report generated.');
      }

    } catch (err) {
      console.error(err);
      setStatus('Error executing scenario. Check parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="p-3 widget-cip-ai" 
      style={{ 
        width: '100%', 
        height: '100%', 
        overflowY: 'auto', 
        backgroundColor: '#f8fafc', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0] || 'widget_1'}
        onActiveViewChange={activeViewChangeHandler}
      />

      {/* PRIMARY CONTROLLER CARD */}
      <div 
        className="card border-0 mb-3" 
        style={{ 
          borderRadius: '12px', 
          backgroundColor: '#ffffff', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}
      >
        <div className="card-body p-3">
          
          {/* HEADER */}
          <div className="d-flex align-items-center mb-2">
            <div 
              className="d-flex align-items-center justify-content-center mr-2" 
              style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                color: '#ffffff',
                boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
              }}
            >
              <span style={{ fontSize: '13px' }}>⚡</span>
            </div>
            <div>
              <h6 className="mb-0 font-weight-bold" style={{ fontSize: '13px', color: '#0f172a', letterSpacing: '-0.2px' }}>
                CIP Scenario Engine
              </h6>
              <small style={{ fontSize: '10px', color: '#64748b' }}>AI Pavement Optimization & Analytics</small>
            </div>
          </div>

          {/* PROMPT TEXTAREA */}
          <div className="mb-2">
            <textarea
              className="form-control"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., show me all roads at risk of depreciation and scheduled for treatment..."
              style={{ 
                width: '100%', 
                backgroundColor: '#f8fafc', 
                borderRadius: '8px', 
                fontSize: '12px', 
                color: '#1e293b', 
                border: '1px solid #cbd5e1',
                padding: '8px 10px',
                lineHeight: '1.45',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          {/* QUICK PROMPT PILLS */}
          <div className="d-flex flex-wrap gap-1 mb-2">
            <button 
              type="button" 
              className="btn btn-sm text-left py-1 px-2 mr-1 mb-1" 
              style={{ 
                fontSize: '10.5px', 
                borderRadius: '6px', 
                backgroundColor: '#eff6ff', 
                color: '#1d4ed8', 
                border: '1px solid #bfdbfe',
                fontWeight: 500
              }}
              onClick={() => { 
                const p = "generate a 5 year cip on accepted roads with a $2M budget"; 
                setPrompt(p); 
                handleRunScenario(p); 
              }}
            >
              ⚡ 5-Yr $2M CIP
            </button>
            <button 
              type="button" 
              className="btn btn-sm text-left py-1 px-2 mr-1 mb-1" 
              style={{ 
                fontSize: '10.5px', 
                borderRadius: '6px', 
                backgroundColor: '#f8fafc', 
                color: '#334155', 
                border: '1px solid #cbd5e1',
                fontWeight: 500
              }}
              onClick={() => { 
                const p = "show top 5 roads in each repair method by cbv for each treatment year"; 
                setPrompt(p); 
                handleRunScenario(p); 
              }}
            >
              📊 Top Roads by Method
            </button>
            <button 
              type="button" 
              className="btn btn-sm text-left py-1 px-2 mr-1 mb-1" 
              style={{ 
                fontSize: '10.5px', 
                borderRadius: '6px', 
                backgroundColor: '#fffbeb', 
                color: '#b45309', 
                border: '1px solid #fde68a',
                fontWeight: 500
              }}
              onClick={() => { 
                const p = "show roads at risk of depreciating into the next repair method over next 3 years"; 
                setPrompt(p); 
                handleRunScenario(p); 
              }}
            >
              ⚠️ Cost of Delay
            </button>
          </div>

          {/* MAP EXTENT CHECKBOX */}
          <div className="d-flex align-items-center mb-3">
            <input
              type="checkbox"
              id="spatialExtentCheck"
              checked={restrictExtent}
              onChange={(e) => setRestrictExtent(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#2563eb', width: '13px', height: '13px' }}
            />
            <label 
              htmlFor="spatialExtentCheck" 
              className="mb-0 ml-2" 
              style={{ cursor: 'pointer', fontSize: '11px', color: '#475569', fontWeight: 500 }}
            >
              Restrict scenario to current map extent
            </label>
          </div>

          {/* ACTIONS */}
          <div className="d-flex" style={{ gap: '6px' }}>
            <button 
              className="btn flex-fill py-2 text-white font-weight-bold" 
              onClick={() => handleRunScenario()}
              disabled={loading}
              style={{ 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                fontSize: '12px',
                border: 'none',
                boxShadow: '0 2px 4px rgba(15,23,42,0.2)',
                letterSpacing: '0.2px'
              }}
            >
              {loading ? 'Processing Model...' : 'Run Scenario'}
            </button>

            <button 
              type="button" 
              className="btn py-2 px-3 font-weight-bold" 
              onClick={handleResetMap}
              style={{ 
                borderRadius: '8px', 
                fontSize: '12px', 
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155'
              }}
              title="Reset definition expressions and restore layer links"
            >
              🔄 Reset
            </button>
          </div>

        </div>
      </div>

      {/* STATUS RIBBON */}
      {status && (
        <div 
          className="d-flex align-items-center mb-3 px-3 py-2" 
          style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            borderLeft: '3px solid #2563eb', 
            border: '1px solid #e2e8f0',
            borderLeftWidth: '3px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <span 
            className="mr-2" 
            style={{ 
              width: '7px', 
              height: '7px', 
              borderRadius: '50%', 
              backgroundColor: loading ? '#f59e0b' : '#10b981',
              display: 'inline-block' 
            }} 
          />
          <span style={{ fontSize: '11.5px', color: '#334155', fontWeight: 500 }}>{status}</span>
        </div>
      )}

      {/* 1. COMPOUND FILTER & INVENTORY REPORT CARD */}
      {Array.isArray(aiData?.filterBreakdown) && aiData.filterBreakdown.length > 0 && (
        <div 
          className="card border-0 mb-3" 
          style={{ 
            borderRadius: '12px', 
            backgroundColor: '#ffffff', 
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div 
            className="d-flex align-items-center justify-content-between p-3 border-bottom"
            style={{ borderColor: '#e2e8f0' }}
          >
            <div>
              <h6 className="mb-0 font-weight-bold" style={{ fontSize: '12.5px', color: '#1e293b' }}>
                Roadway Schedule & Risk Analysis
              </h6>
              <small style={{ fontSize: '10px', color: '#64748b' }}>
                {aiData.featureCount || aiData.filterBreakdown.reduce((acc: number, y: any) => acc + (y.segments?.length || 0), 0)} Segments Matched
              </small>
            </div>
            
            <button 
              type="button"
              className="btn btn-sm font-weight-bold py-1 px-2" 
              style={{ 
                fontSize: '11px', 
                borderRadius: '6px', 
                backgroundColor: '#f1f5f9', 
                color: '#334155', 
                border: '1px solid #cbd5e1'
              }}
              onClick={handleExportFilterCSV}
            >
              📥 Export CSV
            </button>
          </div>

          <div className="p-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {aiData.filterBreakdown.map((yearGroup: any, yIdx: number) => {
              const segs = yearGroup.segments || [];
              const groupSchedCost = segs.reduce((acc: number, s: any) => acc + (s.currentCost || 0), 0);
              const groupProjCost = segs.reduce((acc: number, s: any) => acc + (s.projectedCost || 0), 0);
              const groupJump = segs.reduce((acc: number, s: any) => acc + (s.costJump || 0), 0);

              return (
                <div 
                  key={yIdx} 
                  className="mb-2 p-2" 
                  style={{ 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0' 
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="font-weight-bold" style={{ fontSize: '12px', color: '#0f172a' }}>
                      {yearGroup.year === 'Unscheduled' ? '📋 Unscheduled Inventory' : `🗓️ ${yearGroup.year} Treatments`} ({segs.length} segments)
                    </span>
                    {groupJump > 0 && (
                      <span 
                        className="font-weight-bold px-2 py-0.5" 
                        style={{ 
                          fontSize: '10px', 
                          borderRadius: '4px',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c'
                        }}
                      >
                        Delay Penalty: +${groupJump.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ paddingLeft: '4px' }}>
                    {segs.map((st: any, sIdx: number) => (
                      <div 
                        key={sIdx} 
                        className="py-2"
                        style={{ borderBottom: sIdx !== segs.length - 1 ? '1px dashed #e2e8f0' : 'none' }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: 600 }}>
                            {st.street}
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#475569', fontWeight: 500 }}>
                            {st.length?.toLocaleString()} ft
                          </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                            RSR: <strong style={{ color: '#0f172a' }}>{st.currentRsr}</strong> → <span style={{ color: '#dc2626' }}>{st.projectedRsr}</span>
                            {st.depreciatingYear && st.depreciatingYear !== 'N/A' && (
                              <span className="ml-1 badge badge-light border text-muted" style={{ fontSize: '9px' }}>
                                Drops {st.depreciatingYear}
                              </span>
                            )}
                          </span>

                          <div className="text-right">
                            <span style={{ fontSize: '10.5px', color: '#0369a1', fontWeight: 500 }}>
                              Sched: ${st.currentCost?.toLocaleString()}
                            </span>
                            <span className="mx-1" style={{ color: '#cbd5e1' }}>→</span>
                            <span style={{ fontSize: '10.5px', color: '#dc2626', fontWeight: 600 }}>
                              Proj: ${st.projectedCost?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CIP SCHEDULE REPORT CARD */}
      {Array.isArray(aiData?.cipAllocations) && aiData.cipAllocations.length > 0 && (
        <div 
          className="card border-0 mb-3" 
          style={{ 
            borderRadius: '12px', 
            backgroundColor: '#ffffff', 
            border: '1px solid #bae6fd',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div 
            className="d-flex align-items-center justify-content-between p-3 border-bottom"
            style={{ borderColor: '#e0f2fe' }}
          >
            <div>
              <h6 className="mb-0 font-weight-bold" style={{ fontSize: '12.5px', color: '#0369a1' }}>
                Recommended CIP Schedule
              </h6>
              <small style={{ fontSize: '10px', color: '#64748b' }}>CBV Priority Optimization</small>
            </div>
            
            <button 
              type="button"
              className="btn btn-sm font-weight-bold py-1 px-2" 
              style={{ 
                fontSize: '11px', 
                borderRadius: '6px', 
                backgroundColor: '#e0f2fe', 
                color: '#0284c7', 
                border: '1px solid #bae6fd'
              }}
              onClick={handleExportCIPScheduleCSV}
            >
              📥 Export CSV
            </button>
          </div>

          <div className="p-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {aiData.cipAllocations.map((yearGroup: any, yIdx: number) => {
              const streets = yearGroup.streets || [];
              const yearlyTotal = streets.reduce((acc: number, st: any) => acc + (st.cost || 0), 0);

              return (
                <div 
                  key={yIdx} 
                  className="mb-2 p-2" 
                  style={{ 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: '8px', 
                    border: '1px solid #e0f2fe' 
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="font-weight-bold" style={{ fontSize: '12px', color: '#0c4a6e' }}>
                      🗓️ {yearGroup.year} Treatments ({streets.length} roads)
                    </span>
                    <span 
                      className="font-weight-bold px-2 py-0.5" 
                      style={{ 
                        fontSize: '10.5px', 
                        borderRadius: '4px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff'
                      }}
                    >
                      ${yearlyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })} /${yearGroup.budget?.toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ paddingLeft: '4px' }}>
                    {streets.map((st: any, sIdx: number) => (
                      <div 
                        key={sIdx} 
                        className="py-1 d-flex justify-content-between align-items-center"
                        style={{ borderBottom: sIdx !== streets.length - 1 ? '1px dashed #e0f2fe' : 'none' }}
                      >
                        <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: 500 }}>
                          {st.street || 'Unknown Street'}
                        </span>
                        <div className="text-right">
                          <span style={{ fontSize: '10.5px', color: '#16a34a', fontWeight: 600 }}>
                            CBV {st.cbv}
                          </span>
                          <span className="mx-1" style={{ color: '#cbd5e1' }}>|</span>
                          <span style={{ fontSize: '10.5px', color: '#475569', fontWeight: 500 }}>
                            ${st.cost?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. DEPRECIATION CARD */}
      {Array.isArray(aiData?.depreciationBreakdown) && aiData.depreciationBreakdown.length > 0 && (
        <div 
          className="card border-0 mb-3" 
          style={{ 
            borderRadius: '12px', 
            backgroundColor: '#ffffff', 
            border: '1px solid #fde68a',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div 
            className="d-flex align-items-center justify-content-between p-3 border-bottom"
            style={{ borderColor: '#fef3c7' }}
          >
            <div>
              <h6 className="mb-0 font-weight-bold" style={{ fontSize: '12.5px', color: '#b45309' }}>
                Depreciation Risk & Cost of Delay
              </h6>
              <small style={{ fontSize: '10px', color: '#64748b' }}>Tipping Point Deterioration Model</small>
            </div>
            
            <button 
              type="button"
              className="btn btn-sm font-weight-bold py-1 px-2" 
              style={{ 
                fontSize: '11px', 
                borderRadius: '6px', 
                backgroundColor: '#fef3c7', 
                color: '#92400e', 
                border: '1px solid #fde68a'
              }}
              onClick={handleExportDepreciationCSV}
            >
              📥 Export CSV
            </button>
          </div>

          <div className="p-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {aiData.depreciationBreakdown.map((yearGroup: any, yIdx: number) => {
              const crossings = yearGroup.crossings || yearGroup.streets || [];
              const yearlyTotalJump = crossings.reduce((acc: number, st: any) => acc + (st.repairCostJump || 0), 0);

              return (
                <div 
                  key={yIdx} 
                  className="mb-2 p-2" 
                  style={{ 
                    backgroundColor: '#fffbeb', 
                    borderRadius: '8px', 
                    border: '1px solid #fef3c7' 
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="font-weight-bold" style={{ fontSize: '12px', color: '#78350f' }}>
                      🗓️ {yearGroup.year}
                    </span>
                    <span 
                      className="font-weight-bold px-2 py-0.5" 
                      style={{ 
                        fontSize: '10.5px', 
                        borderRadius: '4px',
                        backgroundColor: '#d97706',
                        color: '#ffffff'
                      }}
                    >
                      Cost Jump: +${yearlyTotalJump.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div style={{ paddingLeft: '4px' }}>
                    {crossings.map((st: any, sIdx: number) => (
                      <div 
                        key={sIdx} 
                        className="py-1"
                        style={{ borderBottom: sIdx !== crossings.length - 1 ? '1px dashed #fde68a' : 'none' }}
                      >
                        <div className="d-flex justify-content-between">
                          <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: 600 }}>
                            {st.street || st.streetName || st}
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#dc2626', fontWeight: 600 }}>
                            +${st.repairCostJump?.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>
                          RSR {st.meanCurrentRsr} → {st.projectedRsr} | <span style={{ color: '#b45309' }}>{st.currentCategory} → {st.futureCategory}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. NESTED REPORT CARD (ANALYTICAL QUERY) */}
      {Array.isArray(aiData?.nestedBreakdown) && aiData.nestedBreakdown.length > 0 && (
        <div 
          className="card border-0 mb-3" 
          style={{ 
            borderRadius: '12px', 
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div className="p-3 border-bottom" style={{ borderColor: '#f1f5f9' }}>
            <h6 className="mb-0 font-weight-bold" style={{ fontSize: '12.5px', color: '#0f172a' }}>
              Top Roadways by Methodology
            </h6>
            <small style={{ fontSize: '10px', color: '#64748b' }}>Ranked by Mean Cost-Benefit Value (CBV)</small>
          </div>

          <div className="p-3">
            {aiData.nestedBreakdown.map((yearGroup: any, yIdx: number) => (
              <div key={yIdx} className="mb-3">
                <span 
                  className="badge px-2 py-1 font-weight-bold mb-2" 
                  style={{ backgroundColor: '#e2e8f0', color: '#334155', fontSize: '10.5px', borderRadius: '4px' }}
                >
                  🗓️ Scheduled Year: {yearGroup.year}
                </span>
                
                {yearGroup.methodologies.map((mGroup: any, mIdx: number) => (
                  <div 
                    key={mIdx} 
                    className="p-2 mb-2" 
                    style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="font-weight-bold" style={{ fontSize: '11px', color: '#1e293b' }}>
                        🛠️ {mGroup.methodology}
                      </span>
                      <small style={{ color: '#64748b', fontSize: '10px' }}>{mGroup.totalUniqueStreets} assets</small>
                    </div>
                    
                    <div style={{ paddingLeft: '4px' }}>
                      {mGroup.topStreets.map((st: any, sIdx: number) => (
                        <div 
                          key={sIdx} 
                          className="py-1 d-flex justify-content-between align-items-center"
                          style={{ borderBottom: sIdx !== mGroup.topStreets.length - 1 ? '1px dashed #e2e8f0' : 'none' }}
                        >
                          <span style={{ fontSize: '10.5px', color: '#334155', fontWeight: 500 }}>
                            {st.street}
                          </span>
                          <span style={{ fontSize: '10px', color: '#0f172a' }}>
                            CBV <strong style={{ color: '#16a34a' }}>{st.cbv}</strong> (${st.cost.toLocaleString()})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EXECUTIVE SUMMARY CARD */}
      {aiData?.summary && 
       (!Array.isArray(aiData?.filterBreakdown) || aiData.filterBreakdown.length === 0) &&
       (!Array.isArray(aiData?.cipAllocations) || aiData.cipAllocations.length === 0) &&
       (!Array.isArray(aiData?.nestedBreakdown) || aiData.nestedBreakdown.length === 0) && 
       (!Array.isArray(aiData?.depreciationBreakdown) || aiData.depreciationBreakdown.length === 0) && (
        <div 
          className="card border-0 mb-3" 
          style={{ 
            borderRadius: '12px', 
            backgroundColor: '#ffffff', 
            borderLeft: '4px solid #10b981',
            border: '1px solid #e2e8f0',
            borderLeftWidth: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div className="p-3">
            <h6 className="font-weight-bold mb-1" style={{ fontSize: '11px', color: '#047857', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Executive Summary
            </h6>
            <p className="mb-0" style={{ fontSize: '11.5px', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {aiData.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}