# MongoDB Connection Troubleshooting

The connection test failed with the following error:
`querySrv ECONNREFUSED _mongodb._tcp.cluster0.girivc7.mongodb.net`

This is a **Network Error**, meaning your computer cannot reach the MongoDB server. It is usually caused by one of three things:

## 1. IP Address Not Whitelisted (Most Likely)
MongoDB Atlas blocks all connections by default. You must allow your IP address.

**How to Fix:**
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Network Access** in the left sidebar.
3. Click **Add IP Address**.
4. Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Note: This is safe for development. For production, you would whitelist specific server IPs.*
5. Click **Confirm**.
6. Wait 1-2 minutes for changes to apply.
7. Try connecting again.

## 2. Incorrect Connection String
Double-check that you copied the connection string exactly as shown in Atlas.

- **Check:** Does your cluster URL look exactly like `cluster0.girivc7.mongodb.net`?
- **Action:** Go to your Cluster > Connect > Drivers and copy the string again. Compare it with what's in `.env.local`.

## 3. Firewall / VPN Blocking
Some corporate firewalls or VPNs block MongoDB connections (port 27017).

- **Action:** Try disconnecting from your VPN.
- **Action:** If on a strict network (like a school or office), try using a mobile hotspot to test if the network is the issue.

---

### Retrying the Test
Run the test script again after making changes:
```bash
node test-connection.js
```
