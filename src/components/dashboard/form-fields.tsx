import type { FormState } from "@/lib/forms";

const inputClass =
  "mt-2 block w-full rounded-md border border-soos-line bg-soos-surface px-3 text-sm text-soos-navy placeholder:text-soos-muted/70 focus:border-soos-violet focus:outline-none aria-invalid:border-soos-expense";

type BaseProps = {
  name: string;
  label: string;
  state: FormState;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
};

function Label({ name, label, required }: Pick<BaseProps, "name" | "label" | "required">) {
  return (
    <label htmlFor={name} className="block text-sm font-semibold text-soos-navy">
      {label}
      {required ? (
        <span className="text-soos-expense" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

function FieldMessage({ name, state, hint }: Pick<BaseProps, "name" | "state" | "hint">) {
  const error = state.errors?.[name];
  if (error) {
    return (
      <p id={`${name}-fout`} className="mt-1.5 text-xs font-semibold text-soos-expense">
        {error}
      </p>
    );
  }
  return hint ? (
    <p id={`${name}-hint`} className="mt-1.5 text-xs text-soos-muted">
      {hint}
    </p>
  ) : null;
}

function a11y(name: string, state: FormState, hint?: string) {
  const error = state.errors?.[name];
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-fout` : hint ? `${name}-hint` : undefined,
  } as const;
}

function valueOf(props: BaseProps) {
  return props.state.values?.[props.name] ?? props.defaultValue ?? "";
}

export function TextField(
  props: BaseProps & {
    type?: "text" | "email" | "url" | "date" | "time" | "number";
    placeholder?: string;
    step?: string;
    min?: string;
    inputMode?: "decimal" | "text";
  },
) {
  const { name, label, state, required, hint, type = "text", placeholder, step, min, inputMode } = props;
  return (
    <div>
      <Label name={name} label={label} required={required} />
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        min={min}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        defaultValue={valueOf(props)}
        // key zorgt dat de waarde na een mislukte poging opnieuw wordt ingevuld
        key={valueOf(props)}
        className={`${inputClass} h-11`}
        {...a11y(name, state, hint)}
      />
      <FieldMessage name={name} state={state} hint={hint} />
    </div>
  );
}

export function TextAreaField(props: BaseProps & { rows?: number; placeholder?: string }) {
  const { name, label, state, required, hint, rows = 6, placeholder } = props;
  return (
    <div>
      <Label name={name} label={label} required={required} />
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        defaultValue={valueOf(props)}
        key={valueOf(props)}
        className={`${inputClass} py-2.5 leading-relaxed`}
        {...a11y(name, state, hint)}
      />
      <FieldMessage name={name} state={state} hint={hint} />
    </div>
  );
}

export function SelectField(
  props: BaseProps & { options: { value: string; label: string }[] },
) {
  const { name, label, state, required, hint, options } = props;
  return (
    <div>
      <Label name={name} label={label} required={required} />
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={valueOf(props)}
        key={valueOf(props)}
        className={`${inputClass} h-11`}
        {...a11y(name, state, hint)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldMessage name={name} state={state} hint={hint} />
    </div>
  );
}

export function CheckboxField({
  name,
  label,
  state,
  defaultChecked,
  hint,
}: Omit<BaseProps, "defaultValue" | "required"> & { defaultChecked?: boolean }) {
  const checked = state.values ? state.values[name] === "on" : defaultChecked;
  return (
    <div>
      <label className="flex items-center gap-3 text-sm font-semibold text-soos-navy">
        <input
          type="checkbox"
          name={name}
          defaultChecked={checked}
          key={String(checked)}
          className="size-4 rounded border-soos-line accent-soos-violet"
        />
        {label}
      </label>
      <FieldMessage name={name} state={state} hint={hint} />
    </div>
  );
}

export function FormError({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-soos-expense/30 bg-soos-expense-soft px-4 py-3 text-sm font-semibold text-soos-expense"
    >
      {state.message}
    </p>
  );
}
