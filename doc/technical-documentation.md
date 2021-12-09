## Overal Architecture Design

## Database Structure

Sentinel Database
- door-activation
  - door-id: activation-status
- doors
  - door-id
    - access
      - user-id
        - time-weekly-whitelist
          - access-data
            - access-timeframe
          - access-token
    - owners
      - user-id
        - access-token
- usernames
  - username
    - case-stylized: cs-username
    - owner: user-id
- usernames
  - access
    - user-id
      - owned
        - door-id
          - access-token: access-token
          - nickname: nickname
      - shared
        - door-id
          - access-tokens
            - time-weekly-whitelist: access-token
          - nickname: nickname
- private
  - user-id
    - username: username
- public
  - user-id
    - username: username
