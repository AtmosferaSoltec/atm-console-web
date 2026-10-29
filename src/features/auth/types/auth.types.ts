export interface LoginFormValues {
  username: string
  password: string
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void
  isLoading: boolean
  error: string | null
}
