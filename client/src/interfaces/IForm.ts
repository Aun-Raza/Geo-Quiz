export interface IInputProps {
  label: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
}
