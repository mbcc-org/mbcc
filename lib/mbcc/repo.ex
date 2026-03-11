defmodule MBCC.Repo do
  use Ecto.Repo,
    otp_app: :mbcc,
    adapter: Ecto.Adapters.Postgres
end
