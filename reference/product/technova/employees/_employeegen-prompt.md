# TechNova Team Generation Prompt

You are assisting with creating realistic organizational data for TechNova Global, a hypothetical Fortune 500 technology company used for demonstration purposes in the Conceptor project. All information you need about TechNova is available in the Conceptor project knowledge base.

## Task

I need you to generate a sample team hierarchy suitable for use in our development environment. We want to strike a balance between realistic complexity and ease of use/computational resources during development.

## Requirements for Team Structure

1. Start at the CEO.

2. Generate two C-Suite executives, each with two VPs under them.

3. Create two directors and an administrative assistant under each VP. (The admin assistant should be an L4.)

4. Create two managers under each director. For one director in the tree, also create a team lead reporting directly to the director (simulating a "missing" manager).

5. Create two team leads under each manager.

6. Create two or three individual contributors under each team lead.

- Give each executive, VP, director, and manager distinct and not overlapping (but plausibly interacting) responsibilities. We want a good reason to, when we start generating details and history about employees, to be able to generate reasonable interaction points.
- Exactly one individual contributor in the tree should be `enabled: false` (they no longer work here).

- `id` should be `EMP###`, where `###` is zero-padded and monotonically ascending from `001`.

## Employee Data Schema

Use our JSON Schema, stored in our project knowledge base, to generate employee data. It should look generally like this:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TechNova Employee",
  "type": "object",
  "required": ["id", "name", "enabled", "title", "level", "department", "manager_id", "hire_date", "relationships", "information"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier for the employee"
    },
    "name": {
      "type": "object",
      "description": "Employee's name components",
      "required": ["given", "family", "name-order"],
      "properties": {
        "given": {
          "type": "string",
          "description": "First name"
        },
        "family": {
          "type": "string",
          "description": "Last name"
        },
        "name-order": {
          "type": "string",
          "enum": ["family-first", "given-first"],
          "description": "Name order convention"
        },
        "override": {
          "type": "string",
          "description": "Override for name display, e.g. 'John (Johnny) Smith'"
        }
      }
    },
    "enabled": {
      "type": "boolean",
      "description": "Whether employee is currently active"
    },
    "title": {
      "type": "string",
      "description": "Official job title"
    },
    "level": {
      "type": "string",
      "enum": ["L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"],
      "description": "Internal level/grade. L10 is the CEO, L9 is C-suite, L8 is SVP, L7 is VP, L6 is Director, L5 is Manager, L4 is Senior, L3 is Mid, L2 is Junior."
    },
    "department": {
      "type": "string",
      "description": "Primary department or business unit"
    },
    "sub_department": {
      "type": "string",
      "description": "Sub-unit within department; omit if not applicable"
    },
    "team": {
      "type": "string",
      "description": "Team name; omit if not applicable"
    },
    "hire_date": {
      "type": "string",
      "format": "date",
      "description": "Original hire date"
    },

    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "target": {
            "type": "string",
            "description": "ID of the related person"
          },
          "kind": {
            "type": "string",
            "enum": ["manager", "dotted-line", "works-with"],
            "description": "Type of relationship. Omit peers, as they are inferred from their manager relationship and same-named team (used to create organizational units)."
          }
        }
      }
    },

    "information": {
      "type": "array",
      "description": "Pre-seeded information (answers to questions from the user) to load into the database as if these responses came from the employee.",
      "items": {
        "type": "object",
        "required": ["prompt", "response"],
        "properties": {
          "prompt": {
            "type": "string",
            "description": "The question asked to the employee, verbatim. Eventually these will be generated by the Conceptor strategic layer."
          },
          "response": {
            "type": "string",
            "description": "The verbatim response from the employee."
          }
        }
      }
    }
  }
}
```

For now, leave `information` as an empty array.

## Diversity Considerations

Ensure the generated data includes:
- Geographic diversity appropriate to the function
- Mix of tenure lengths (veterans and recent hires)
- Skills relevant to the specific department and products