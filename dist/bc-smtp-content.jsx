/* bc-smtp-content.jsx — body of the BC SMTP OAuth2 post.
   Exposes window.BCSmtpContent which renders inside .post-content. */

const Img = ({ src, caption }) => (
  <figure className="post-figure">
    <img src={src} alt={caption} loading="lazy" />
    <figcaption>{caption}</figcaption>
  </figure>
);

const Code = ({ children, lang = "powershell" }) => {
  const [copied, setCopied] = React.useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div className="code-block">
      <div className="code-head">
        <span className="code-lang">{lang}</span>
        <button className={"code-copy " + (copied ? "copied" : "")} onClick={onCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
};

const Callout = ({ kind = "note", title, children }) => (
  <div className={"callout callout-" + kind}>
    <div className="callout-title">{title}</div>
    <div className="callout-body">{children}</div>
  </div>
);

const Step = ({ n, total, section, title, children }) => (
  <section className="post-step" id={"step-" + n}>
    <div className="step-meta">
      <span className="step-num">Step {n}</span>
      <span className="step-of">of {total} · {section}</span>
    </div>
    <h3 className="step-title">{title}</h3>
    <div className="step-body">{children}</div>
  </section>
);

const SectionHead = ({ kicker, title, sub }) => (
  <header className="post-section-head" id={"sec-" + kicker.replace(/\s+/g,'-').toLowerCase()}>
    <div className="post-section-kicker">// {kicker}</div>
    <h2 className="post-section-title">{title}</h2>
    {sub ? <p className="post-section-sub">{sub}</p> : null}
  </header>
);

const Table = ({ rows }) => (
  <div className="post-table-wrap">
    <table className="post-table">
      <thead><tr>{rows[0].map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.slice(1).map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SHOTS = "bc-smtp-screenshots/";

const BCSmtpContent = () => (
  <>
    <div className="post-overview">
      <p className="post-overview-lede">
        Sending email from Business Central used to mean basic SMTP with a username and password. Microsoft has been deprecating that for years. The replacement — <strong>SMTP AUTH with OAuth 2.0</strong> — works, but only if you stitch together four moving pieces in the right order: an Azure App Registration, an Exchange Online service principal, mailbox-scoped permissions, and the BC email account itself.
      </p>
      <p>
        I've set this up for clients more times than I'd like, and almost every failed attempt traces back to the <em>same</em> two or three places. This walkthrough is the order I now follow on every new tenant. Eighteen steps across four sections — sign in to Azure, configure Exchange via PowerShell, verify the token, finish in BC.
      </p>
      <div className="post-overview-grid">
        <div><span className="oi-num">01</span><span className="oi-label">Azure Portal</span><span className="oi-sub">5 steps · App registration &amp; SMTP.SendAsApp</span></div>
        <div><span className="oi-num">02</span><span className="oi-label">Exchange Online</span><span className="oi-sub">6 steps · Service principal &amp; mailbox scope</span></div>
        <div><span className="oi-num">03</span><span className="oi-label">Token Verification</span><span className="oi-sub">1 step · Confirm config before BC</span></div>
        <div><span className="oi-num">04</span><span className="oi-label">Business Central</span><span className="oi-sub">6 steps · Email account &amp; test send</span></div>
      </div>
    </div>

    {/* SECTION 1 */}
    <SectionHead kicker="Section 1" title="Azure Portal" sub="Create the App Registration and grant SMTP.SendAsApp permission."/>

    <Step n={1} total={18} section="Azure Portal" title="Sign in to the Azure Portal">
      <ol>
        <li>Open <code>portal.azure.com</code>.</li>
        <li>Sign in with a <strong>Global Administrator</strong> account.</li>
        <li>You'll land on the Azure Portal home page.</li>
      </ol>
      <Img src={SHOTS + "00.png"} caption="Azure Portal home screen after signing in as Global Administrator." />
    </Step>

    <Step n={2} total={18} section="Azure Portal" title="Navigate to App Registrations">
      <ol>
        <li>Top search bar → type <strong>Microsoft Entra ID</strong>.</li>
        <li>Click <strong>Microsoft Entra ID</strong> from the search results.</li>
        <li>In the left sidebar, click <strong>App registrations</strong>.</li>
      </ol>
      <Img src={SHOTS + "01.png"} caption="Microsoft Entra ID — left sidebar showing App registrations highlighted." />
    </Step>

    <Step n={3} total={18} section="Azure Portal" title="Create a new App Registration">
      <ol>
        <li>Click <strong>+ New registration</strong> at the top.</li>
        <li><strong>Name:</strong> something descriptive — e.g. <code>BC SMTP OAuth Test</code>.</li>
        <li><strong>Supported account types:</strong> <em>Accounts in this organizational directory only (Single tenant)</em>.</li>
        <li><strong>Redirect URI:</strong> <em>Web</em> → <code>https://businesscentral.dynamics.com/OAuthLanding.htm</code></li>
        <li>Click <strong>Register</strong>.</li>
      </ol>
      <Img src={SHOTS + "02.png"} caption="New App Registration form — Name, account type, and Redirect URI filled in." />
      <Callout kind="warn" title="Save these values now">
        Once registered, the Overview page shows your <strong>Application (Client) ID</strong> and <strong>Directory (Tenant) ID</strong>. Copy both — you'll need them in Sections 2, 3, and 4.
      </Callout>
      <Table rows={[
        ["Value to save", "Where to find it"],
        ["Application (Client) ID", "Overview page — first field"],
        ["Directory (Tenant) ID", "Overview page — second field"],
      ]}/>
      <Img src={SHOTS + "03.png"} caption="App registration Overview page — Client ID and Tenant ID highlighted." />
    </Step>

    <Step n={4} total={18} section="Azure Portal" title="Add the SMTP.SendAsApp permission">
      <ol>
        <li>Left sidebar → <strong>API permissions</strong>.</li>
        <li>Click <strong>+ Add a permission</strong>.</li>
        <li>Tab: <strong>APIs my organization uses</strong>.</li>
        <li>Search <strong>Office 365 Exchange Online</strong> → click it.</li>
        <li>Select <strong>Application permissions</strong> (NOT Delegated).</li>
        <li>Tick <strong>SMTP.SendAsApp</strong>.</li>
        <li>Click <strong>Add permissions</strong>.</li>
      </ol>
      <Img src={SHOTS + "04.png"} caption="API permissions — Office 365 Exchange Online > SMTP.SendAsApp (Application) ticked." />
      <Callout kind="warn" title="The permission shows 'Not granted' — fix it now">
        Adding the permission isn't enough. Without admin consent it will silently fail later in Business Central. Grant it before continuing.
      </Callout>
      <ol start="8">
        <li>Click <strong>Grant admin consent for &lt;YourTenant&gt;</strong>.</li>
        <li>Click <strong>Yes</strong> on the confirmation dialog.</li>
        <li>Confirm the Status column shows a green tick: <strong>Granted</strong>.</li>
      </ol>
      <Img src={SHOTS + "05.png"} caption="API permissions — SMTP.SendAsApp showing green Granted status." />
    </Step>

    <Step n={5} total={18} section="Azure Portal" title="Create a Client Secret">
      <ol>
        <li>Left sidebar → <strong>Certificates &amp; secrets</strong>.</li>
        <li>Click <strong>+ New client secret</strong>.</li>
        <li>Description: <code>BC SMTP Key</code> (or similar).</li>
        <li>Click <strong>Add</strong>.</li>
      </ol>
      <Callout kind="critical" title="Copy the Value field right now">
        Once you navigate away, the <strong>Value</strong> is never shown again. The <strong>Secret ID</strong> is <em>not</em> what you need — you want the <strong>Value</strong> column.
      </Callout>
      <Img src={SHOTS + "06.png"} caption="Certificates & secrets — newly created secret with Value column highlighted." />
      <Callout kind="success" title="Section 1 complete">
        You now have: Client ID, Tenant ID, Client Secret, and SMTP.SendAsApp granted with admin consent. Keep these values handy.
      </Callout>
    </Step>

    {/* SECTION 2 */}
    <SectionHead kicker="Section 2" title="Exchange Online" sub="Service principal, mailbox access, SMTP authentication."/>

    <Step n={6} total={18} section="Exchange Online" title="Get the Enterprise Application Object ID">
      <p>
        This is the step that catches everyone. The <strong>Object ID</strong> from <em>Enterprise Applications</em> is <strong>not</strong> the same as the <em>Application (Client) ID</em> from <em>App Registrations</em>. Exchange wants the Enterprise App Object ID — using the wrong one is the most common cause of "does not have Send As permissions" errors later.
      </p>
      <ol>
        <li>In Entra ID, go to <strong>Enterprise applications</strong>.</li>
        <li>Search for your app name (<code>BC SMTP OAuth Test</code>) and open it.</li>
        <li>From the Overview, copy the <strong>Object ID</strong>.</li>
      </ol>
      <Img src={SHOTS + "07.png"} caption="Enterprise Applications > your app > Overview — Object ID field highlighted." />
    </Step>

    <Step n={7} total={18} section="Exchange Online" title="Connect to Exchange Online via PowerShell">
      <p>Open <strong>Windows PowerShell as Administrator</strong> and run:</p>
      <Code lang="powershell">{`Install-Module -Name ExchangeOnlineManagement -Force
Import-Module ExchangeOnlineManagement
Connect-ExchangeOnline -UserPrincipalName <GlobalAdminUPN@yourdomain.com>`}</Code>
    </Step>

    <Step n={8} total={18} section="Exchange Online" title="Create a Service Principal in Exchange">
      <p>Replace placeholders with your real IDs from Section 1 / Step 6:</p>
      <Code lang="powershell">{`New-ServicePrincipal `+
`-AppId <Application-Client-Id> `+
`-ObjectId <Enterprise-App-Object-Id> `+
`-DisplayName "BC SMTP Service Principal"`}</Code>
      <Callout kind="note" title="On the -AppId switch">
        Older Exchange Online PowerShell modules don't accept <code>-AppId</code>. If you get a parameter-not-found error, use <code>Get-ServicePrincipal | Where-Object &#123; $_.AppId -eq "&lt;id&gt;" &#125;</code> to verify it was created via Entra sync instead.
      </Callout>
    </Step>

    <Step n={9} total={18} section="Exchange Online" title="Grant Mailbox Access — scoped to one mailbox">
      <p>This is the key restriction: the app gets access to <strong>one</strong> sender mailbox, nothing else. Don't use a wildcard.</p>
      <Code lang="powershell">{`Add-MailboxPermission `+
`-Identity "<SenderMailbox@yourdomain.com>" `+
`-User <Enterprise-App-Object-Id> `+
`-AccessRights FullAccess`}</Code>
      <Callout kind="warn" title="Object ID, not Client ID">
        Use the <strong>Enterprise Application Object ID</strong> here — the one from Step 6, not Step 3.
      </Callout>
    </Step>

    <Step n={10} total={18} section="Exchange Online" title="Enable SMTP Authentication on the mailbox">
      <p>SMTP AUTH is disabled by default at both the tenant and mailbox level. Enable it on the specific sender mailbox:</p>
      <Code lang="powershell">{`Set-CASMailbox `+
`-Identity "<SenderMailbox@yourdomain.com>" `+
`-SmtpClientAuthenticationDisabled $false`}</Code>
    </Step>

    <Step n={11} total={18} section="Exchange Online" title="Verify and disconnect">
      <p>Confirm the configuration before moving on:</p>
      <Code lang="powershell">{`# Confirm service principal exists
Get-ServicePrincipal | Where-Object { $_.DisplayName -eq "BC SMTP Service Principal" }

# Confirm mailbox permission
Get-MailboxPermission -Identity "<SenderMailbox@yourdomain.com>" | `+
`Where-Object { $_.User -like "*<Enterprise-App-Object-Id>*" }

# Confirm SMTP Auth is on
Get-CASMailbox -Identity "<SenderMailbox@yourdomain.com>" | `+
`Format-List SmtpClientAuthenticationDisabled

# Done
Disconnect-ExchangeOnline -Confirm:$false`}</Code>
      <p>Expected: <code>SmtpClientAuthenticationDisabled : False</code>.</p>
    </Step>

    {/* SECTION 3 */}
    <SectionHead kicker="Section 3" title="Token Verification" sub="Acquire a token outside Business Central first — it's the fastest way to catch config errors."/>

    <Step n={12} total={18} section="Token Verification" title="Test token acquisition with PowerShell">
      <p>
        Run this <em>before</em> touching Business Central. If it fails here, BC will fail too — and BC's error messages are far less useful.
      </p>
      <Code lang="powershell">{`$tenantId = "<Directory-Tenant-Id>"
$clientId = "<Application-Client-Id>"
$clientSecret = "<Client-Secret-Value>"

$body = @{
    client_id     = $clientId
    scope         = "https://outlook.office365.com/.default"
    client_secret = $clientSecret
    grant_type    = "client_credentials"
}

$response = Invoke-RestMethod `+
`-Method POST `+
`-Uri "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token" `+
`-Body $body

$response.access_token`}</Code>
      <p>A long token string means everything is wired up. An HTTP 401 or "invalid_client" means the secret is wrong or admin consent wasn't granted in Step 4.</p>
    </Step>

    {/* SECTION 4 */}
    <SectionHead kicker="Section 4" title="Business Central" sub="Configure the SMTP account using OAuth 2.0 custom credentials."/>

    <Step n={13} total={18} section="Business Central" title="Open Email Accounts">
      <ol>
        <li>Sign in to <strong>Business Central</strong>.</li>
        <li>Press <code>Alt+Q</code> (or click the search icon).</li>
        <li>Type <strong>Email Accounts</strong> and press Enter.</li>
        <li>Click the <strong>Email Accounts</strong> result.</li>
      </ol>
      <Img src={SHOTS + "08.png"} caption="Business Central — search results showing the Email Accounts page." />
    </Step>

    <Step n={14} total={18} section="Business Central" title="Add a new SMTP account">
      <ol>
        <li>On the Email Accounts page, click <strong>+ New</strong> in the ribbon.</li>
        <li>The <strong>Add Email Account</strong> wizard opens. Click <strong>Next</strong>.</li>
        <li>Select <strong>SMTP</strong> from the connectors.</li>
        <li>Click <strong>Next</strong>.</li>
      </ol>
      <Img src={SHOTS + "09.png"} caption="BC Add Email Account wizard — SMTP connector selected." />
    </Step>

    <Step n={15} total={18} section="Business Central" title="Configure SMTP server settings">
      <p>Click <strong>Apply Office 365 Server Settings</strong> to auto-fill, then verify:</p>
      <Table rows={[
        ["Field", "Value"],
        ["Server URL", <code>smtp.office365.com</code>],
        ["Port", <code>587</code>],
        ["Authentication", <strong>OAuth 2.0</strong>],
        ["Email Address", "<SenderMailbox@yourdomain.com> (the restricted sender from Step 9)"],
        ["Sender Name", "Your preferred display name"],
        ["Sender Type", "Specific User"],
      ]}/>
      <Img src={SHOTS + "10.png"} caption="BC SMTP Account page — all server fields filled in, Authentication set to OAuth 2.0." />
    </Step>

    <Step n={16} total={18} section="Business Central" title="Enter custom OAuth 2.0 credentials">
      <p>Click <strong>Set Custom Credentials</strong> and enter:</p>
      <Table rows={[
        ["Field", "Value", "From"],
        ["Client ID", "Application (Client) ID", "Step 3 — App registration Overview"],
        ["Client Secret", "Secret Value (NOT Secret ID)", "Step 5 — Certificates & secrets"],
        ["Tenant ID", "Directory (Tenant) ID", "Step 3 — App registration Overview"],
      ]}/>
      <Callout kind="warn" title="Same app, end-to-end">
        The Client ID must be from the <em>same</em> App Registration where you granted SMTP.SendAsApp. A different one will fail authentication — silently — at send time.
      </Callout>
      <Callout kind="note" title="On secure storage">
        Once saved, BC stores the Client ID, Client Secret, and Tenant ID in <strong>isolated storage</strong> — a private store managed exclusively by the <em>Email — SMTP Connector</em> app published by Microsoft. They can only be read by that app, never exposed in plain text, and not visible to other extensions or users.
      </Callout>
      <Img src={SHOTS + "11.png"} caption="BC SMTP Account — OAuth 2.0 custom credentials entered." />
    </Step>

    <Step n={17} total={18} section="Business Central" title="Authenticate and save">
      <ol>
        <li>Click <strong>Authenticate</strong> (or <strong>Get Token</strong>). A sign-in popup may appear.</li>
        <li>Sign in with the <strong>Global Administrator</strong> account when prompted.</li>
        <li>Click <strong>Next</strong> in the wizard.</li>
        <li>Click <strong>Finish</strong>.</li>
      </ol>
      <Callout kind="critical" title="If authentication fails — start over">
        Don't try to edit the failed account. BC stores a corrupted token that <em>can't</em> be repaired. Delete the SMTP account, generate a fresh client secret in Entra (Step 5), and walk back through from Step 14. It sounds drastic; it's the only path that works.
      </Callout>
      <Img src={SHOTS + "12.png"} caption="Microsoft account picker — select the Global Administrator account." />
      <Img src={SHOTS + "13.png"} caption="Permissions requested — review and click Accept to grant the app permission to send via SMTP AUTH." />
      <Img src={SHOTS + "14.png"} caption="BC Email Accounts list — new SMTP account showing as Active." />
    </Step>

    <Step n={18} total={18} section="Business Central" title="Send a test email">
      <ol>
        <li>Select your new SMTP account on the Email Accounts page.</li>
        <li>Click <strong>Send Test Email</strong> from the ribbon.</li>
        <li>Enter your own address as the recipient and click <strong>Send</strong>.</li>
        <li>Check your inbox.</li>
      </ol>
      <Img src={SHOTS + "15.png"} caption="BC Send Test Email — success confirmation and email received in inbox." />
    </Step>

    {/* TROUBLESHOOTING */}
    <SectionHead kicker="Reference" title="Troubleshooting" sub="The five errors that cover roughly 95% of failed setups."/>

    <div className="trouble-list">
      <div className="trouble-row">
        <div className="trouble-err">Unable to get SMTP Account password</div>
        <div className="trouble-cause">BC stored a corrupted token from a previous failed setup.</div>
        <div className="trouble-fix">Delete the BC SMTP account. Generate a new client secret in Entra. Re-add from scratch (Step 14).</div>
      </div>
      <div className="trouble-row">
        <div className="trouble-err">Failed to acquire token · HTTP 401</div>
        <div className="trouble-cause">SMTP.SendAsApp not consented, or wrong Client ID / Secret.</div>
        <div className="trouble-fix">Grant admin consent in Entra. Run the token test (Step 12) before returning to BC.</div>
      </div>
      <div className="trouble-row">
        <div className="trouble-err">SMTP Error 535</div>
        <div className="trouble-cause">SMTP Auth disabled on mailbox or at tenant level.</div>
        <div className="trouble-fix">Run <code>Set-CASMailbox -SmtpClientAuthenticationDisabled $false</code> (Step 10).</div>
      </div>
      <div className="trouble-row">
        <div className="trouble-err">-AppId parameter not found</div>
        <div className="trouble-cause">Older Exchange Online PowerShell module.</div>
        <div className="trouble-fix">Use <code>Get-ServicePrincipal | Where-Object &#123; $_.AppId -eq "&lt;id&gt;" &#125;</code> instead.</div>
      </div>
      <div className="trouble-row">
        <div className="trouble-err">Does not have Send As permissions</div>
        <div className="trouble-cause">Wrong Object ID used, or <code>Add-MailboxPermission</code> not run.</div>
        <div className="trouble-fix">Re-run Step 9 with the <strong>Enterprise App Object ID</strong> — not the Client ID.</div>
      </div>
    </div>

    {/* CHECKLIST */}
    <SectionHead kicker="Wrap" title="Final checklist" sub="Nine things to confirm before declaring this done."/>

    <ol className="post-checklist">
      <li>Azure App Registration created — Client ID &amp; Tenant ID noted.</li>
      <li>SMTP.SendAsApp — admin consent granted in Entra ID.</li>
      <li>Client Secret generated and saved securely.</li>
      <li>Exchange service principal created via PowerShell.</li>
      <li>Mailbox FullAccess granted to the app (<code>Add-MailboxPermission</code>).</li>
      <li>SMTP Auth enabled on the mailbox (<code>SmtpClientAuthenticationDisabled : False</code>).</li>
      <li>OAuth token test passed via PowerShell.</li>
      <li>BC SMTP Account configured with OAuth 2.0 custom credentials.</li>
      <li>Test email sent and received from Business Central.</li>
    </ol>

    <p className="post-outro">
      That's the whole chain. The wins from this setup over basic auth are real — no shared mailbox passwords, scoped to one sender, revocable per-secret, and aligned with where Microsoft is forcing everyone in 2026 anyway.
    </p>
    <p className="post-outro-sig">— Sudip Shrestha · Dogma Group · Kathmandu</p>
  </>
);

window.BCSmtpContent = BCSmtpContent;
