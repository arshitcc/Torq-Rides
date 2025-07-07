export const getStatusColor = (status: string) => {
  switch (status) {
    case "OK":
      return "bg-green-100 text-green-800";
    case "DUE-SERVICE":
      return "bg-yellow-100 text-yellow-800";
    case "IN-SERVICE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};