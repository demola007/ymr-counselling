export interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  className?: string;
  hint?: string;
}

export interface SelectFieldProps {
  label: string;
  id: string;
  required?: boolean;
  options: { value: string; label: string; }[];
  placeholder?: string;
}