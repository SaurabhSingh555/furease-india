import type { OrderFormFields } from "../types";

export type ValidationErrors = Partial<Record<keyof OrderFormFields, string>>;

export function validateOrderForm(values: OrderFormFields) {
  const errors: ValidationErrors = {};

  if (!values.customer_name.trim()) errors.customer_name = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(values.mobile_number.trim())) {
    errors.mobile_number = "Enter a valid 10-digit Indian mobile number.";
  }
  if (values.address.trim().length < 12) {
    errors.address = "Enter a complete address with house number and area.";
  }
  if (!values.city.trim()) errors.city = "City is required.";
  if (!values.state.trim()) errors.state = "State is required.";
  if (!/^\d{6}$/.test(values.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode.";
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors) {
  return Object.keys(errors).length > 0;
}