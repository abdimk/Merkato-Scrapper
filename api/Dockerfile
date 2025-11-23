FROM python:3.11-alpine AS builder

WORKDIR /app

RUN apk add --no-cache build-base

COPY api/requirements.txt . 

RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-alpine


WORKDIR /app

COPY --from=builder /root/.local /root/.local

ENV PATH=/root/.local/bin:$PATH

COPY api ./api 

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]