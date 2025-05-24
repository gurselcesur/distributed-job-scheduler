cmake_minimum_required(VERSION 3.10)
project(DistributedJobScheduler)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
set(SERVER_SRC src/backend/scheduler_server.cpp)
set(CLIENT_SRC src/backend/scheduler_client.cpp)

# Executables
add_executable(scheduler_server ${SERVER_SRC})
add_executable(scheduler_client ${CLIENT_SRC})

# Link pthread for server and standard C++ for both (explicit for macOS ARM64 safety)
target_link_libraries(scheduler_server pthread stdc++)
target_link_libraries(scheduler_client stdc++)

# Output to src/backend/
set_target_properties(scheduler_server PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/src/backend)
set_target_properties(scheduler_client PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/src/backend)