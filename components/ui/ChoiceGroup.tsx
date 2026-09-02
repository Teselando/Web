type ChoiceOption = {
  description?: string;
  label: string;
  value: string;
};

type ChoiceGroupProps = {
  defaultValue?: string;
  description?: string;
  disabled?: boolean;
  legend: string;
  name: string;
  onChange?: (value: string) => void;
  options: ChoiceOption[];
  required?: boolean;
  value?: string;
};

export function ChoiceGroup({ defaultValue, description, disabled = false, legend, name, onChange, options, required = false, value }: ChoiceGroupProps) {
  const descriptionId = description ? `${name}-description` : undefined;
  return (
    <fieldset aria-describedby={descriptionId} className="choice-group" disabled={disabled}>
      <legend>{legend}{required ? <span aria-hidden="true"> *</span> : null}</legend>
      {description ? <p className="choice-group__description" id={descriptionId}>{description}</p> : null}
      <div className="choice-group__options">
        {options.map((option) => (
          <label className="choice" key={option.value}>
            <input checked={value === undefined ? undefined : value === option.value} defaultChecked={value === undefined ? defaultValue === option.value : undefined} name={name} onChange={() => onChange?.(option.value)} required={required} type="radio" value={option.value} />
            <span className="choice__control" aria-hidden="true" />
            <span className="choice__content"><span>{option.label}</span>{option.description ? <small>{option.description}</small> : null}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
