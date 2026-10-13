import { React } from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components';

const Setting = (props: AllWidgetSettingProps<any>) => {
  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  };

  return (
    <div className="widget-setting-cip-ai p-3">
      <div className="option-setting-section">
        <label className="font-weight-bold d-block mb-2">Select Map Widget</label>
        <MapWidgetSelector
          useMapWidgetIds={props.useMapWidgetIds}
          onSelect={onMapWidgetSelected}
        />
      </div>
    </div>
  );
};

export default Setting;