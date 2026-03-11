defmodule MBCCWeb.PageController do
  use MBCCWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
