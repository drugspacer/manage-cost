FROM openjdk:19

ARG PROJECT

COPY /target/$PROJECT.jar /app.jar

CMD ["java", "-jar", "/app.jar", "--version"]
