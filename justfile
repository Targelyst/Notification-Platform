docker-cmd := "podman"

# Show available recipes
default:
  @just --list

# Start development backend infrastructure
start-backend-infra:
  cd NotificationPlatform && {{ docker-cmd }} compose up -d --no-recreate

# Start development backend
start-backend: start-backend-infra
  cd NotificationPlatform && dotnet run

# Clear the development database
clear-db:
  cd NotificationPlatform && dotnet ef database drop -f && dotnet ef database update --no-build

alias bdev := start-backend
