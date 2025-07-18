import { Input } from "@/components/ui/input";
import {
  CheckCircleIcon,
  ClockIcon,
  WrenchIcon,
  AlertTriangleIcon,
  XCircleIcon,
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "OK":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "DUE-SERVICE":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "IN-SERVICE":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "IN-REPAIR":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "OK":
      return <CheckCircleIcon className="h-4 w-4" />;
    case "DUE-SERVICE":
      return <ClockIcon className="h-4 w-4" />;
    case "IN-SERVICE":
      return <WrenchIcon className="h-4 w-4" />;
    case "IN-REPAIR":
      return <AlertTriangleIcon className="h-4 w-4" />;
    default:
      return <XCircleIcon className="h-4 w-4" />;
  }
};

const NumericInput = ({
  field,
  isFloat = false,
  placeholder,
}: {
  field: any;
  isFloat?: boolean;
  placeholder?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = isFloat ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
    if (regex.test(value)) {
      // For react-hook-form, it's better to pass the coerced number or undefined
      const numericValue = value === "" ? undefined : Number(value);
      field.onChange(numericValue);
    }
  };

  return (
    <Input
      {...field}
      value={field.value ?? ""}
      onChange={handleChange}
      placeholder={placeholder}
      className="border-yellow-primary/30 focus:border-yellow-primary"
    />
  );
};

export { getStatusColor, getStatusIcon, NumericInput };
