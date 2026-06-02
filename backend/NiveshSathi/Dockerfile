FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# Install Maven and build the jar from the NiveshSathi subfolder
RUN apt-get update && apt-get install -y maven \
    && cd NiveshSathi \
    && mvn -q -DskipTests package

CMD ["java", "-jar", "NiveshSathi/target/NiveshSathi-0.0.1-SNAPSHOT.jar"]
