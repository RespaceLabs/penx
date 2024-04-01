export type Reward = {
  amount: number
  token: string
}

export type User = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export type Issue = {
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  id: number
  node_id: string
  number: number
  title: string
  user: User
  labels: Label[]
  state: string
  locked: boolean
  assignee: any
  assignees: any[]
  milestone: any
  comments: number
  created_at: string
  updated_at: string
  closed_at: any
  author_association: string
  active_lock_reason: any
  body: any
  reactions: Reactions
  timeline_url: string
  performed_via_github_app: any
  state_reason: any
  pull_request: Pull_request
}
type Pull_request = {
  url: 'https://api.github.com/repos/penxio/penx-101/pulls/3'
  html_url: 'https://github.com/penxio/penx-101/pull/3'
  diff_url: 'https://github.com/penxio/penx-101/pull/3.diff'
  patch_url: 'https://github.com/penxio/penx-101/pull/3.patch'
  merged_at: null
}

export type Label = {
  id: number
  node_id: string
  url: string
  name: string
  color: string
  default: boolean
  description: string
}

type Reactions = {
  url: string
  total_count: number
  '+1': number
  '-1': number
  laugh: number
  hooray: number
  confused: number
  heart: number
  rocket: number
  eyes: number
}

export type Comment = {
  url: string
  html_url: string
  issue_url: string
  id: number
  node_id: string
  user: User
  created_at: string
  updated_at: string
  author_association: string
  body: string
  reactions: Reactions
  performed_via_github_app: any
}

type Organization = {
  login: string
  id: number
  node_id: string
  url: string
  repos_url: string
  events_url: string
  hooks_url: string
  issues_url: string
  members_url: string
  public_members_url: string
  avatar_url: string
  description: string
}

type Repository = {
  id: 695140438
  node_id: 'R_kgDOKW8AVg'
  name: 'penx-101'
  full_name: 'penxio/penx-101'
  private: false
  owner: User
  html_url: 'https://github.com/penxio/penx-101'
  description: null
  fork: false
  url: 'https://api.github.com/repos/penxio/penx-101'
  forks_url: 'https://api.github.com/repos/penxio/penx-101/forks'
  keys_url: 'https://api.github.com/repos/penxio/penx-101/keys{/key_id}'
  collaborators_url: 'https://api.github.com/repos/penxio/penx-101/collaborators{/collaborator}'
  teams_url: 'https://api.github.com/repos/penxio/penx-101/teams'
  hooks_url: 'https://api.github.com/repos/penxio/penx-101/hooks'
  issue_events_url: 'https://api.github.com/repos/penxio/penx-101/issues/events{/number}'
  events_url: 'https://api.github.com/repos/penxio/penx-101/events'
  assignees_url: 'https://api.github.com/repos/penxio/penx-101/assignees{/user}'
  branches_url: 'https://api.github.com/repos/penxio/penx-101/branches{/branch}'
  tags_url: 'https://api.github.com/repos/penxio/penx-101/tags'
  blobs_url: 'https://api.github.com/repos/penxio/penx-101/git/blobs{/sha}'
  git_tags_url: 'https://api.github.com/repos/penxio/penx-101/git/tags{/sha}'
  git_refs_url: 'https://api.github.com/repos/penxio/penx-101/git/refs{/sha}'
  trees_url: 'https://api.github.com/repos/penxio/penx-101/git/trees{/sha}'
  statuses_url: 'https://api.github.com/repos/penxio/penx-101/statuses/{sha}'
  languages_url: 'https://api.github.com/repos/penxio/penx-101/languages'
  stargazers_url: 'https://api.github.com/repos/penxio/penx-101/stargazers'
  contributors_url: 'https://api.github.com/repos/penxio/penx-101/contributors'
  subscribers_url: 'https://api.github.com/repos/penxio/penx-101/subscribers'
  subscription_url: 'https://api.github.com/repos/penxio/penx-101/subscription'
  commits_url: 'https://api.github.com/repos/penxio/penx-101/commits{/sha}'
  git_commits_url: 'https://api.github.com/repos/penxio/penx-101/git/commits{/sha}'
  comments_url: 'https://api.github.com/repos/penxio/penx-101/comments{/number}'
  issue_comment_url: 'https://api.github.com/repos/penxio/penx-101/issues/comments{/number}'
  contents_url: 'https://api.github.com/repos/penxio/penx-101/contents/{+path}'
  compare_url: 'https://api.github.com/repos/penxio/penx-101/compare/{base}...{head}'
  merges_url: 'https://api.github.com/repos/penxio/penx-101/merges'
  archive_url: 'https://api.github.com/repos/penxio/penx-101/{archive_format}{/ref}'
  downloads_url: 'https://api.github.com/repos/penxio/penx-101/downloads'
  issues_url: 'https://api.github.com/repos/penxio/penx-101/issues{/number}'
  pulls_url: 'https://api.github.com/repos/penxio/penx-101/pulls{/number}'
  milestones_url: 'https://api.github.com/repos/penxio/penx-101/milestones{/number}'
  notifications_url: 'https://api.github.com/repos/penxio/penx-101/notifications{?since,all,participating}'
  labels_url: 'https://api.github.com/repos/penxio/penx-101/labels{/name}'
  releases_url: 'https://api.github.com/repos/penxio/penx-101/releases{/id}'
  deployments_url: 'https://api.github.com/repos/penxio/penx-101/deployments'
  created_at: '2023-09-22T12:50:39Z'
  updated_at: '2023-11-13T14:07:59Z'
  pushed_at: '2024-02-06T07:23:20Z'
  git_url: 'git://github.com/penxio/penx-101.git'
  ssh_url: 'git@github.com:penxio/penx-101.git'
  clone_url: 'https://github.com/penxio/penx-101.git'
  svn_url: 'https://github.com/penxio/penx-101'
  homepage: null
  size: 1062
  stargazers_count: 0
  watchers_count: 0
  language: null
  has_issues: true
  has_projects: true
  has_downloads: true
  has_wiki: true
  has_pages: false
  has_discussions: false
  forks_count: 0
  mirror_url: null
  archived: false
  disabled: false
  open_issues_count: 1
  license: null
  allow_forking: true
  is_template: false
  web_commit_signoff_required: false
  topics: any[]
  visibility: string
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
  custom_properties: any
}

export type IssueCommentEvent = {
  action: 'created'
  issue: Issue
  comment: Comment
  repository: Repository
  organization: Organization
  sender: User
  installation: {
    id: number
    node_id: string
  }
}
