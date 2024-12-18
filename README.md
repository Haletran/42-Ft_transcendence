# 42-Ft\_transcendence

![image](https://github.com/user-attachments/assets/f266f930-f28c-4535-9c52-ea2ea5d4e442)

## Doc

[Nginx (Reverse Proxy)](https://docs.nginx.com/nginx/admin-guide/web-server/)

[Django (backend)](https://docs.djangoproject.com/en/5.1/)


## How to make the website work outside the VM

Change the `Network` in bridged mode in VirtualBox
- Add your IP to django-credentials/credentials here :
```
CORS_ALLOWED_ORIGINS = [ 
    ## add your IP here
    'https://localhost',
]

CSRF_TRUSTED_ORIGINS = [
    ## add your IP here
    'https://localhost',
]
```


## Update gitignore

```bash
git rm -r --cached .
```
Then commit/push and it should work properly :)
