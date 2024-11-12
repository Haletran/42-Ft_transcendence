with import <nixpkgs> {};
with pkgs.python3Packages;

stdenv.mkDerivation {
  name = "python";

  buildInputs = [
    gdal
    geos
    pip
    python3Full
    virtualenv
    postgresql
  ];

  LD_LIBRARY_PATH="${geos}/lib:${gdal}/lib";

  shellHook = ''
    SOURCE_DATE_EPOCH=$(date +%s)  # so that we can use python wheels
    YELLOW='\033[1;33m'
    NC="$(printf '\033[0m')"
    PROJECT_NAME="myproject"
    PORT=8000

    cd dev_backend
    echo -e "''${YELLOW}Creating python environment...''${NC}"
    virtualenv --no-setuptools venv > /dev/null
    export PATH=$PWD/venv/bin:$PATH > /dev/null
    source venv/bin/activate > /dev/null
    
    echo -e "''${YELLOW}Installing python packages...''${NC}"
    python -m pip install Django psycopg
    pip install psycopg2-binary django-cors-headers djangorestframework

    echo -e "''${YELLOW}Running Django server...''${NC}"
    if [ ! -d $PROJECT_NAME ]; then
        echo -e "''${YELLOW}Creating Django project...''${NC}"
        django-admin startproject $PROJECT_NAME .
    fi
    python manage.py migrate
    xdg-open http://localhost:$PORT 1> /dev/null 2>&1
    python manage.py runserver $PORT
  '';
}
