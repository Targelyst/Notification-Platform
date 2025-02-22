using CommandLine;

namespace NotificationPlatform.Scripts;

public static class Program {

    public static int Main(string[] args) {
        return Parser
            .Default
            .ParseArguments<GenerateTypesOptions>(args)
            .MapResult(
                GenerateTypesCommand.Run,
                errors => 1
            );
    }

}