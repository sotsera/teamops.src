namespace Sotsera.Blazor.Bootstrap.Extensions
{
    internal static class StringExtensions
    {
        public static bool IsEmpty(this string value) => string.IsNullOrWhiteSpace(value);
        public static bool IsNotEmpty(this string value) => !string.IsNullOrWhiteSpace(value);
        public static string Trimmed(this string value) => string.IsNullOrWhiteSpace(value) ? string.Empty: value.Trim();
    }
}
