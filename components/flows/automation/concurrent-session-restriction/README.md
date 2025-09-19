# Concurrent Session Restriction - Salesforce Flow

## 📋 What It Does
Prevents users from having multiple active sessions simultaneously by terminating existing sessions when a new login occurs. Enhances security by ensuring only one active session per user.

## 📊 Quick Info

| Property | Value |
|----------|--------|
| **Flow Type** | Auto-Launched Flow (Subflow) |
| **Category** | automation |
| **Tags** | `security`, `session-management`, `login-flow`, `concurrent-sessions` |
| **Complexity** | Intermediate |
| **Team** | Security/Platform Team |
| **Contact** | security-team@company.com |

## 🔧 What You Need

### Required Permissions
- **Manage Users**: To terminate existing sessions
- **View Setup and Configuration**: To access session data
- **Modify All Data**: For system-level operations

### Required Objects and Fields
- **AuthSession**: Standard object (no custom fields needed)
- **User**: Standard object access for session management

### Other Requirements
- Must be used as a subflow within a Login Flow
- Requires Experience Cloud or Digital Experience license for Login Flow functionality

## 🚀 How to Install

### Step 1: Deploy the Flow
```bash
# Deploy the flow
sfdx force:source:deploy -p force-app/main/default/flows/Concurrent_Session_Restriction.flow -u [your-org]
```

### Step 2: Activate the Flow
1. Go to Setup → Process Automation → Flows
2. Find your flow: `Concurrent Session Restriction`
3. Click **Activate**

### Step 3: Configure Your Login Flow
1. Go to Setup → Identity → Login Flows
2. Create or edit your existing Login Flow
3. Add a subflow element
4. Select the "Concurrent Session Restriction" flow
5. Configure the input variables (User ID)

## 💻 How to Use

### When It Runs
**Trigger**: Called as a subflow during user login process
**Conditions**: Every time a user attempts to log in

### What It Does
1. **Receives User ID**: Gets the user ID from the parent Login Flow
2. **Queries Active Sessions**: Finds all active sessions for the user
3. **Terminates Existing Sessions**: Ends any existing active sessions
4. **Allows New Login**: Permits the new login session to proceed

### Configuration Options
| Setting | What It Does | How to Change |
|---------|--------------|---------------|
| Max Sessions Allowed | Number of concurrent sessions (default: 1) | Modify the flow constant `const_MaxSessions` |
| Session Timeout | Grace period before termination | Modify flow logic for timeout handling |
| Exclude Admin Users | Skip restriction for admin users | Add decision element for admin profile check |

## 🧪 Testing

### Test It Works
1. **Test Scenario 1**: Single User Login
   - Log in as test user from browser 1
   - Expected result: Login successful, session active
   
2. **Test Scenario 2**: Concurrent Login Attempt
   - While session from Test 1 is active, log in as same user from browser 2
   - Expected result: Browser 1 session terminated, browser 2 login successful
   
3. **Test Scenario 3**: Admin User (if configured)
   - Log in as admin user from multiple browsers
   - Expected result: Multiple sessions allowed (if admin exclusion is configured)

### Debug Issues
- Check Setup → Login History for session termination events
- Use Setup → Debug Logs to trace flow execution
- Monitor Setup → Session Management for active sessions

## 🐛 Common Issues

**Issue**: Flow doesn't run during login
- **Solution**: Ensure flow is properly added to Login Flow and Login Flow is assigned to the community/org

**Issue**: Sessions not being terminated
- **Solution**: Verify user running the flow has "Manage Users" permission

**Issue**: Flow fails with permission error
- **Solution**: Check that the flow runs in system context or user has required permissions

## 🔒 Security Considerations

### Privacy and Compliance
- **Session Data**: Flow only accesses session metadata, not session content
- **User Impact**: Users may experience unexpected logouts when this is first implemented
- **Audit Trail**: All session terminations are logged in Login History

### Best Practices
- **User Communication**: Inform users about the single session policy
- **Exception Handling**: Consider allowing multiple sessions for specific users/profiles if needed
- **Monitoring**: Regular review of session termination logs

## 📋 Implementation Example

### Sample Login Flow Structure
```
Login Flow: "Secure Login Process"
├── Decision: Check User Profile
├── Subflow: Concurrent Session Restriction
├── Decision: Additional Security Checks
└── Finish: Complete Login
```

### Integration with Other Security Measures
- **MFA Requirements**: Use alongside multi-factor authentication
- **Login Hour Restrictions**: Combine with time-based access controls
- **IP Restrictions**: Layer with network-based security

## 📚 Related Resources

### Salesforce Documentation
- [Login Flows Documentation](https://help.salesforce.com/s/articleView?id=sf.networks_login_flows.htm)
- [Session Management](https://help.salesforce.com/s/articleView?id=sf.admin_sessions.htm)
- [Security Implementation Guide](https://help.salesforce.com/s/articleView?id=xcloud.security_login_flow_limit_concurrent_sessions.htm)

### Related Components
- **MFA Enforcement Flow**: Multi-factor authentication subflow
- **Login Anomaly Detection**: Unusual login pattern detection
- **Session Timeout Manager**: Automatic session timeout management

## 📞 Get Help
- **Team Contact**: security-team@company.com
- **Security Questions**: Ask in #security-channel
- **Implementation Support**: Contact platform team

---

**Flow by**: Security/Platform Team | **Last updated**: 2025-09-19

## 📝 Technical Implementation Notes

### Flow Variables Used
- `var_UserId` (Input): User ID from login context
- `var_UserSessions` (Variable): Collection of active sessions
- `const_MaxSessions` (Constant): Maximum allowed sessions (default: 1)

### Flow Logic Overview
1. **Get User Sessions**: Query AuthSession where UserId = input and SessionType != 'SubstituteUser'
2. **Count Sessions**: Check if session count > maximum allowed
3. **Terminate Excess**: Delete oldest sessions if limit exceeded
4. **Return Success**: Allow login to proceed

### Error Handling
- **No Sessions Found**: Continue (normal for first login)
- **Query Failures**: Log error but allow login (fail open for security)
- **Termination Failures**: Log but continue (partial success is acceptable)

This flow is based on Salesforce's official security recommendations and can be customized based on your organization's specific security requirements.