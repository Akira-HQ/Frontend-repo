export const validatePassword = (password: string) => {
  const errors = {
    capitalLetter: !/[A-Z]/.test(password),
    number: !/\d/.test(password),
    minLength: password.length < 8,
    maxLength: password.length > 24,
    hasLowercase: !/[a-z]/.test(password),
    specialChar: !/[^a-zA-Z0-9]/.test(password)
  }
  return errors
}