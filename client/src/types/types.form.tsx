export type RadioButtonsProps = {
  labels: string[];
  name: string;
};

export type RadioButtonProps = {
  label: string;
  name: string;
  id: string;
};

export type InputProps = {
  label: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
};

export interface FormProps {
  children: React.ReactNode[];
  onSubmit: (e: React.FormEvent) => void;
}
