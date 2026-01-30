
Factories are functions.
Services are classes.
Repositories are interfaces + implementations.

	•	Domain tests → core package
	•	Service tests → business rules
	•	Repository tests → DB integration

    
Services are for behavior.
Repositories are for access.
Never write through a repository directly.
Reading is fine.
