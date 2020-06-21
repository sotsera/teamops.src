using Sotsera.Blazor.Bootstrap.Extensions;
using System.Text;

namespace Sotsera.Blazor.Bootstrap.Utils
{
    internal interface ICssBuilder
    {
        CssBuilder Add(string cssClass);

        CssBuilder Add(string cssClass, bool condition);

        string Build();
    }

    internal class CssBuilder: ICssBuilder
    {
        private readonly StringBuilder Builder;

        public CssBuilder(string initialClass = null) => Builder = new StringBuilder(initialClass.Trimmed());

        public static implicit operator string(CssBuilder builder) => builder.Build();
        public static explicit operator CssBuilder(string initialClass) => new CssBuilder(initialClass);

        public CssBuilder Add(string cssClass)
        {
            if (cssClass.IsNotEmpty()) Builder.Append(" ").Append(cssClass.Trimmed());
            return this;
        }

        public CssBuilder Add(string cssClass, bool condition) => condition ? Add(cssClass) : this;

        public string Build() => Builder.Length == 0 ? string.Empty: Builder.ToString().TrimStart();

        public override string ToString() => Build();
    }
}
