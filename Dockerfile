FROM bitnami/wildfly:27.0.1-debian-11-r33
COPY ./target/*.war wildfly:/app
EXPOSE 8080, 9990
CMD ["flask", "run"]