FROM python:3.8.5

RUN pip install python-dotenv
RUN pip install pipenv

COPY . /app

ENV HOME /app

WORKDIR ${HOME}

COPY Pipfile Pipfile.lock ${HOME}/

RUN pipenv install --system --deploy

ENTRYPOINT [ "python" ]

EXPOSE 8000

CMD [ "app.py" ]