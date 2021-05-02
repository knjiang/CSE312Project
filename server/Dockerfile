FROM python:3.7

RUN pip3 install pipenv
RUN pip3 install python-dotenv
RUN apt-get update && apt-get install -y --no-install-recommends gcc

COPY Pipfile* .
RUN pipenv lock --keep-outdated --requirements > requirements.txt
RUN pip3 install -r requirements.txt

COPY .env .
COPY *.py . 

EXPOSE 5000

# start app
CMD flask run --host 0.0.0.0
