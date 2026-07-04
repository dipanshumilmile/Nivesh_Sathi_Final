FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# Install Maven and build the jar
RUN apt-get update && apt-get install -y maven \
    && mvn -q -DskipTests package

CMD ["java", "-jar", "target/NiveshSathi-0.0.1-SNAPSHOT.jar"]