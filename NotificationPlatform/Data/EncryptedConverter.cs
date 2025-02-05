using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NotificationPlatform.Services;

namespace NotificationPlatform.Data;

public class EncryptedConverter(
    ICryptographyService cryptographyService,
    ConverterMappingHints? mappingHints = null
) : ValueConverter<string, byte[]>(
    v => cryptographyService.Encrypt(v),
    v => cryptographyService.Decrypt(v),
    mappingHints
) { }