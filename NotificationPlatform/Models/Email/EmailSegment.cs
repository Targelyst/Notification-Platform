using HotChocolate.Data.Sorting;

namespace NotificationPlatform.Models.Email;

public class EmailSegment : KeyedEntity {

    public Guid EmailConfigurationId { get; set; }
    public EmailConfiguration EmailConfiguration { get; set; } = null!;

    public required string Name { get; set; }

    [GraphQLType<JsonType>]
    public required string Expression { get; set; }

}

public class EmailSegmentSortType : SortInputType<EmailSegment> {
    protected override void Configure(ISortInputTypeDescriptor<EmailSegment> descriptor) {
        descriptor.Ignore(es => es.Expression);
    }
}