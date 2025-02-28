using CommandLine;
using NJsonSchema.CodeGeneration.TypeScript;
using NJsonSchema.Generation;
using NotificationPlatform.Models.Email;

namespace NotificationPlatform.Scripts;

[Verb("generate-types", HelpText = "Generate frontpage repository types.")]
public class GenerateTypesOptions {
    [Option('o', "out-dir", Required = true, HelpText = "Directory to generate the types to.")]
    public required string OutDir { get; set; }
}

public static class GenerateTypesCommand {

    public static int Run(GenerateTypesOptions opts) {
        try {
            var settings = new SystemTextJsonSchemaGeneratorSettings {
                SerializerOptions = EmailSegmentExpression.JsonOptions
            };
            var generator = new JsonSchemaGenerator(settings);
            var schema = generator.Generate(typeof(EmailSegmentExpression));

            var tsSettings = new TypeScriptGeneratorSettings {
                TypeStyle = TypeScriptTypeStyle.Interface
            };
            var tsGenerator = new TypeScriptGenerator(schema, tsSettings);
            var tsCode = tsGenerator.GenerateFile();

            var tsOutputPath = Path.Combine(opts.OutDir, "email-segment-expression.ts");
            File.WriteAllText(tsOutputPath, tsCode);

            return 0;
        } catch (Exception e) {
            Console.WriteLine("Error while generating types: {0}", e.Message);
            return 1;
        }
    }

}