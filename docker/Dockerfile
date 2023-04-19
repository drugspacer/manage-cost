FROM openjdk:19

ARG PROJECT

RUN mkdir /logs

COPY /target/$PROJECT.jar /app.jar

CMD ["java", "-jar", "/app.jar"]
