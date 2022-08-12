export interface FormProps {
    onSubmit: (e: React.FormEvent) => void;
    inputs: InputProps[];
}

export interface InputProps {
    label: string;
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    type?: string;
}
