// Resolves the Jira project key from the invocation context.
// Works for both jira:issueContext (extension.project) and jira:globalPage
// (which doesn't have a project; payload.projectId is used as a fallback).

export function projectFromContext(context, fallback) {
  return (
    context?.extension?.project?.key
    ?? context?.extension?.issue?.project?.key
    ?? fallback
    ?? 'UNKNOWN'
  );
}
