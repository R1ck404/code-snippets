function detectLanguage(content: string) {
    const trimmedContent = content.trim();

    const patterns = [
        { lang: 'html', regex: /<[^>]+>/ },
        { lang: 'javascript', regex: /\b(function|var|let|const|console\.log|=>|document\.|window\.)\b/ },
        { lang: 'typescript', regex: /\b(import\s+\w+.*\s+from\s+|interface\s+\w+|type\s+\w+|const\s+\w+:\s+\w+|export\s+\w+)\b/ },
        { lang: 'python', regex: /\b(def\s+|import\s+|\bprint\(|^\s*class\s+)/ },
        { lang: 'cpp', regex: /\b(#include\s+<|\bint\s+main\b|\bstd::|\bcout<<|namespace\s+\w+)\b/ },
        { lang: 'java', regex: /\b(public\s+class\s+|public\s+static\s+void\s+main|System\.out\.println|import\s+java\.)\b/ },
        { lang: 'csharp', regex: /\b(using\s+\w+;|namespace\s+\w+|class\s+\w+|public\s+\w+\s+\w+)\b/ },
        { lang: 'php', regex: /<\?php|echo\s+['"]/ },
        { lang: 'ruby', regex: /\b(def\s+\w+|puts\s+['"]|require\s+['"]|\bend\s+)\b/ },
        { lang: 'go', regex: /\b(import\s+\(|func\s+\w+|\bpackage\s+\w+|fmt\.Println)\b/ },
        { lang: 'swift', regex: /\b(import\s+Foundation|let\s+\w+|var\s+\w+|func\s+\w+)\b/ },
        { lang: 'kotlin', regex: /\b(val\s+\w+|var\s+\w+|fun\s+\w+|\bimport\s+)\b/ },
        { lang: 'rust', regex: /\b(fn\s+\w+|let\s+mut\s+\w+|use\s+\w+|extern\s+crate)\b/ },
        { lang: 'perl', regex: /\b(use\s+[\w:]+;|print\s+["']|sub\s+\w+)/ },
        { lang: 'sql', regex: /\b(SELECT\s+.*\s+FROM\s+|INSERT\s+INTO\s+|UPDATE\s+\w+|DELETE\s+FROM\s+)\b/i },
        { lang: 'shell', regex: /#!\/bin\/bash|#!\/usr\/bin\/env\s+|echo\s+['"]|\bcd\s+|if\s+\[.*\];\s+then\b/ },
        { lang: 'yaml', regex: /^\s*-\s+\w+:\s+\w+/m },
        { lang: 'json', regex: /^\s*\{\s*"\w+":\s*"\w+"/ },
        { lang: 'xml', regex: /^\s*<\?xml\s+version\s*=\s*"\d\.\d"\s*\?>/ }
    ];

    for (const pattern of patterns) {
        if (pattern.regex.test(trimmedContent)) {
            return pattern.lang;
        }
    }

    return 'plaintext';
}

export { detectLanguage };