# Use Java 17 (Spring Boot 3 needs Java 17+)
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy Maven build output
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","/app/app.jar"]
