# SOLalert.wtf

Never transact with sanctioned wallets on Solana. Have access to a dynamic list of sanctioned, lost, and hacked Solana addresses that allows dApp builders to protect their users.

## Getting started

### Querying an address

To determine whether a Solana address has been flagged, sanctioned, or inaccessible, make a HTTP GET request to the following endpoint:

```curl
GET https://jij1fqp80j.execute-api.us-east-1.amazonaws.com/address/<wallet_address>
```

**200 Response**

```json
{
    "wallet_address": "0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a",
    "identifications": [
        {
            "category": "sanctions",
            "name": "SANCTIONS: OFAC SDN Secondeye Solution 2021-04-15 1da5821544e25c636c1417ba96ade4cf6d2f9b5a",
            "description": "Pakistan-based Secondeye Solution (SES), also known as Forwarderz, is a synthetic identity document vendor that was added to the OFAC SDN list in April 2021.\n\nSES customers could buy fake identity documents to sign up for accounts with cryptocurrency exchanges, payment providers, banks, and more under false identities. According to the US Treasury Department, SES assisted the Internet Research Agency (IRA), the Russian troll farm that OFAC designated pursuant to E.O. 13848 in 2018 for interfering in the 2016 presidential election, in concealing its identity to evade sanctions.\n\nhttps://home.treasury.gov/news/press-releases/jy0126",
            "url": "https://home.treasury.gov/news/press-releases/jy0126"
        }
    ]
}
```

NOTE: If an address has no associated flags, `identifications` will be an empty array.

### File an address

To submit a filing for a wallet address make the following HTTP request with the required request body. Please note that payment is required to submit a filing to prevent spam. All payments are made via Solana Pay.

```curl
POST https://jij1fqp80j.execute-api.us-east-1.amazonaws.com/address
```

**Request Body**

```js
{
    "wallet_address": "<wallet_address>",
    "network": 'SOL', // Default is 'SOL'
     "category": 'sanctions', // Enum: ['sanctions', 'lost', 'hacked']
     "name": "<category>: <issuer> <name/entity of owner> <date issued> <wallet_address>", // Psuedo-unique identifier for the filing; should include the category, name of the entity, and wallet address
     "description": "...", // Brief description of the the filing
     "url": '...' // Optional - Url where further information about this wallet address can be found, if not provided, will default to 'https://solalert.wtf'
}
```

**201 Response**

Empty response body.

---

## License

MIT

## Getting help

Need help? We’re here for you. Please email us at [help+solalert@i3.insure](mailto:help+solalert@i3.insure) or [open an issue](github.com/i3-protocol/solalert.wtf/issues/new) on GitHub.

### Submit an issue

To submit an issue, please [open an issue](github.com/i3-protocol/solalert.wtf/issues/new) on GitHub. Please include the following information: 

  * The Solana address you're filing an issue for
  * Do you own the Solana address?
  * Are you appealing a false positive?
  * Provide a description of the issue
  * Have you recovered your Solana address?

### Join the community

Follow us on [Twitter](https://twitter.com/Crypto_i3) for the latest updates.
