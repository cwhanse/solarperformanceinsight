from typing import Optional
from pydantic import BaseSettings, Json
from ._version import version as __version__  # NOQA


class Settings(BaseSettings):
    auth_token_url: str = "https://solarperformanceinsight.us.auth0.com/oauth/token"
    auth_jwk_url: str = (
        "https://solarperformanceinsight.us.auth0.com/.well-known/jwks.json"
    )
    auth_key: Json
    auth_audience: str = "https://app.solarperformanceinsight.org/api"
    auth_issuer: str = "https://solarperformanceinsight.us.auth0.com/"
    auth_client_id: str = "G1YyfLdseYn10RQo11Lqee2ThXj5l5fh"

    traces_sample_rate: Optional[float] = None

    class Config:
        env_prefix = "spi"


settings = Settings()
