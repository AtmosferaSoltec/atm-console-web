export interface LoginFormValues {
  username: string
  password: string
  /** 6-digit code of the authenticator app (TOTP). */
  code: string
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void
  isLoading: boolean
  error: string | null
}
