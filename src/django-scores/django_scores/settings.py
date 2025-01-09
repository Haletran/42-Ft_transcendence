"""
Django settings for django_scores project.

Generated by 'django-admin startproject' using Django 3.2.19.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import os
from pathlib import Path
from hvac import Client

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Vault configurations
VAULT_ADDR = os.getenv('VAULT_ADDR')
VAULT_TOKEN = os.getenv('VAULT_TOKEN', None)

client = Client(url=VAULT_ADDR, token=VAULT_TOKEN)

try:
    # Attempt to fetch the secret stored at the given path in Vault
    secret = client.secrets.kv.v2.read_secret_version(path='data/django/db_scores/')
    
    # Correct way to access the 'value' field from Vault response
    SECRET_KEY = secret['data']['data']['secret_key']
except Exception as e:
    raise RuntimeError(f"Unable to retrieve SECRET_KEY from Vault: {e}")

try:
    # Attempt to fetch the secret stored at the given path in Vault
    secret_db = client.secrets.kv.v2.read_secret_version(path='data/django/db_scores')
    
    # Correct way to access the credentials from Vault response
    db_credentials = secret_db['data']['data']
    POSTGRES_DB = db_credentials['db_name']
    POSTGRES_USER = db_credentials['db_user']
    POSTGRES_PASSWORD = db_credentials['db_password']
    POSTGRES_HOST = db_credentials['db_host']
    POSTGRES_PORT = db_credentials['db_port']

except Exception as e:
    raise RuntimeError(f"Unable to retrieve DB credentials from Vault: {e}")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'daphne',
    'django.contrib.staticfiles',
    'scores',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'django_scores.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_scores.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB_SCORES'),
        'USER': os.getenv('POSTGRES_USER_SCORES'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD_SCORES'),
        'HOST': os.getenv('POSTGRES_HOST_SCORES'),
        'PORT': os.getenv('POSTGRES_PORT_SCORES'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,
        },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# cookie configuration

CSRF_COOKIE_NAME = 'csrftoken'
CSRF_TRUSTED_ORIGINS = [
    'https://localhost',
]
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_PATH = '/'
CSRF_COOKIE_SAMESITE = 'None'
CORS_ALLOWED_ORIGINS = [
    'https://localhost',
]
CORS_ALLOW_CREDENTIALS = True


# cache configuration

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
        # 'OPTIONS': {
        #     'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        # },
        # 'TIMEOUT': None,
    }
}

