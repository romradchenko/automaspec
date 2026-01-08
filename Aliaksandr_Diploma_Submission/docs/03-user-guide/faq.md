# FAQ & Troubleshooting

## Frequently Asked Questions

### General

**Q: What is Automaspec?**

A: Automaspec is an AI-powered test specification and automation platform that helps QA engineers and developers organize test documentation, generate test code using AI, and track test coverage in a centralized location.

---

**Q: Is Automaspec free to use?**

A: Yes, Automaspec offers a free tier that includes all core features. Premium plans may be introduced in the future for advanced features and higher usage limits.

---

**Q: Which testing frameworks are supported?**

A: Currently, Automaspec generates test code for **Vitest**. Support for Jest, Playwright, and Cypress is planned for future releases.

---

### Account & Access

**Q: How do I reset my password?**

A: Click "Forgot Password" on the login page. Enter your email address, and you'll receive a password reset link. The link expires after 24 hours.

---

**Q: Can I belong to multiple organizations?**

A: Yes, you can be a member of multiple organizations. Use the organization switcher in the header to switch between them. Your role may differ across organizations.

---

**Q: How do I leave an organization?**

A: Go to Profile → Organization Settings → Leave Organization. Note: Organization owners cannot leave without transferring ownership first.

---

### Features

**Q: How does AI test generation work?**

A: When you click "Generate with AI", your requirement text and context are sent to our AI service (powered by OpenRouter/Gemini). The AI analyzes your requirement and generates Vitest test code that you can review, edit, and save.

---

**Q: Is my test data secure?**

A: Yes. All data is transmitted over HTTPS and stored in an encrypted database. We do not share your test specifications with third parties. AI generation requests are processed in real-time and not stored by the AI provider.

---

**Q: Can I export my test code?**

A: Yes. Each test includes a code viewer with a copy button. You can also export entire specs as files for integration into your codebase.

---

## Troubleshooting

### Common Issues

| Problem | Possible Cause | Solution |
|---------|---------------|----------|
| Page won't load | Cache issue | Clear browser cache and refresh |
| Can't login | Wrong credentials | Use "Forgot Password" to reset |
| AI generation fails | Rate limit exceeded | Wait a few minutes and try again |
| Changes not saving | Network issue | Check internet connection; changes auto-retry |
| Slow performance | Large dataset | Try filtering or using search |

### Error Messages

| Error Code/Message | Meaning | How to Fix |
|-------------------|---------|------------|
| "Session expired" | Your login session has timed out | Click "Login" to sign in again |
| "Rate limit exceeded" | Too many requests in short time | Wait 1-2 minutes before retrying |
| "Permission denied" | You don't have access to this resource | Contact your organization admin |
| "AI service unavailable" | AI provider is temporarily down | Try again in a few minutes |
| "Invalid input" | Form validation failed | Check all required fields are filled |

### Browser-Specific Issues

| Browser | Known Issue | Workaround |
|---------|-------------|------------|
| Safari | Cookies blocked in private mode | Use normal browsing mode |
| Firefox | Strict tracking protection blocks auth | Add site to exceptions |
| Mobile browsers | Keyboard covers input fields | Scroll down or use landscape mode |

## Getting Help

### Self-Service Resources

- [This Documentation](../index.md)
- [API Documentation](https://automaspec.vercel.app/rpc/docs)
- [GitHub Repository](https://github.com/automaspec/automaspec)

### Contact Support

| Channel | Best For |
|---------|----------|
| GitHub Issues | Bug reports, feature requests |
| Email | Account issues, security concerns |

### Reporting Bugs

When reporting a bug, please include:

1. **Steps to reproduce** - What actions lead to the issue?
2. **Expected behavior** - What should happen?
3. **Actual behavior** - What actually happens?
4. **Screenshots** - If applicable
5. **Browser/Device info** - Browser name, version, operating system

Submit bug reports at: [GitHub Issues](https://github.com/automaspec/automaspec/issues)

## Tips for Best Experience

1. **Use Chrome or Firefox** for best compatibility
2. **Keep browser updated** to the latest version
3. **Disable ad blockers** if experiencing login issues
4. **Use descriptive names** for folders and specs
5. **Write detailed requirements** for better AI generation
6. **Save work regularly** (though changes auto-save)
