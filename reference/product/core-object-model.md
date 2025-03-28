# Core Entity Model

## Core Business Entities

### User

Users represent individuals who interact with the organization, including employees and contractors.

**Attributes:**

- `id`: Unique identifier  
- `name`: Full name  
- `title`: Job title  
- `level`: Organizational level/seniority  
- `type`: Employee or Contractor  
- `start_date`: When the user began their relationship with the organization  
- `email`: Contact information  
- `key_skills`: Array of skills and expertise areas  
- `location`: Physical or remote work location  
- `acquired_from`: If the user joined through acquisition, the source company

**Relationships:**

- Occupies one or more Units  
- Participates in Initiatives  
- Provides Answers to Questions  
- Has Relationships with other Users

### Unit

Units represent organizational positions or roles that can be filled by users.

**Attributes:**

- `id`: Unique identifier  
- `name`: Unit name  
- `type`: Individual position, team, management position, etc.  
- `description`: Purpose and function  
- `parent_unit_id`: The larger organizational unit this belongs to  
- `created_date`: When the unit was established  
- `status`: Active, planned, deprecated

**Relationships:**

- Contains child Units  
- Belongs to parent Unit  
- Occupied by one or more Users  
- Implements Capabilities  
- Participates in Initiatives  
- Subject of Questions and Insights

### Initiative

Initiatives represent activities, projects, or efforts that cut across the organization.

**Attributes:**

- `id`: Unique identifier  
- `name`: Initiative name  
- `description`: Purpose and goals  
- `start_date`: When the initiative began  
- `expected_end_date`: Projected completion (if applicable)  
- `actual_end_date`: Actual completion (if applicable)  
- `status`: Planning, active, completed, canceled  
- `priority`: Organizational priority level  
- `initiative_type`: Project, program, transformation, etc.

**Relationships:**

- Involves multiple Units  
- Assigned to Users  
- Requires Capabilities  
- Subject of Questions and Insights  
- Target of Potential Actions

### Capability

Capabilities represent what the organization can do, distinct from how it does it.

**Attributes:**

- `id`: Unique identifier  
- `name`: Capability name  
- `description`: What this capability enables  
- `category`: Business function area  
- `maturity`: Level of organizational proficiency  
- `formality`: Formal (explicitly defined) or informal (emerged through practice)  
- `criticality`: Importance to organizational operations

**Relationships:**

- Implemented by Units  
- Required by Initiatives  
- Dependent on other Capabilities  
- Subject of Questions and Insights  
- Target of Potential Actions

### Relationship

Relationships represent connections between entities in the organization.

**Attributes:**

- `id`: Unique identifier  
- `entity1_id`: First entity in the relationship  
- `entity1_type`: Type of the first entity (User, Unit, etc.)  
- `entity2_id`: Second entity in the relationship  
- `entity2_type`: Type of the second entity  
- `relationship_type`: Nature of the relationship (e.g., reports-to, collaborates-with)  
- `relationship_level`: Formal, informal  
- `relationship_strength`: Measure of connection strength  
- `discovery_method`: How this relationship was identified  
- `relationship_inference`: Whether directly observed or inferred

**Relationships:**

- Connects two entities (User-User, Unit-Unit, User-Unit, etc.)  
- Evidence for Insights  
- Subject of Questions

## Knowledge Acquisition Entities

### Question

Questions represent specific queries presented to users to gather organizational knowledge.

**Attributes:**

- `id`: Unique identifier  
- `text`: The actual question asked  
- `question_type`: Open-ended, verification, depth, resolution, etc.  
- `response_format`: Boolean, gradient, text, multiple choice  
- `subject_ids`: Primary entities being asked about (array of IDs)  
- `subject_types`: Types of the subject entities  
- `object_ids`: Secondary entities referenced (array of IDs)  
- `object_types`: Types of the object entities  
- `staleness_factor`: How quickly this type of question becomes stale  
- `source_agent_id`: Agent that generated this question  

**Relationships:**

- Asked to specific User  
- References Subject entities  
- References Object entities  
- Has one or more Answers  
- Generated by Agent

### Answer

Answers represent responses to specific questions.

**Attributes:**

- `id`: Unique identifier  
- `question_id`: The question being answered  
- `user_id`: User who provided the answer  
- `timestamp`: When the answer was provided  
- `raw_response`: Complete verbatim response  
- `response_type`: Boolean, gradient, text, multiple choice  
- `response_value`: Structured value (for boolean/gradient/multiple choice)  
- `summarization`: Condensed version (for text responses)  
- `transcription_id`: Link to audio transcription (if verbal)  
- `status`: Active, superseded, invalidated  
- `confidence_indicators`: Explicitly stated certainty qualifiers (e.g., "definitely", "unsure")

**Relationships:**

- Provided by User  
- Responds to Question  
- References various entities  
- Supports Insights  
- May supersede other Answers

## Analysis Entities

### Insight

Insights represent patterns, interpretations, and discoveries derived from answers.

**Attributes:**

- `id`: Unique identifier  
- `text`: The insight content  
- `timestamp`: When generated  
- `last_validated`: When last confirmed  
- `source_agent_id`: Agent that generated this insight  
- `subject_ids`: Primary entities the insight is about  
- `subject_types`: Types of subject entities  
- `object_ids`: Other relevant entities  
- `object_types`: Types of object entities  
- `supporting_answer_ids`: Links to specific answers  
- `org_level`: Individual, team, department, or enterprise  
- `confidence_factors`: Quantifiable support metrics (\# of sources, consistency)  
- `staleness`: Current freshness score  
- `insight_type`: Dependency, capability gap, information flow, volunteered information, sentiment, contradiction, etc.  
- `contradiction_status`: Whether this resolves or surfaces contradictions  
- `analysis_method`: Pattern recognition, sentiment analysis, volunteer information identification, etc.

**Relationships:**

- Generated by Agent  
- Concerns Subject entities  
- References Object entities  
- Supported by Answers  
- Related to other Insights  
- May lead to Potential Actions

### Potential Action

Potential Actions represent suggested responses to insights.

**Attributes:**

- `id`: Unique identifier  
- `description`: What should be done  
- `insight_ids`: What observation(s) this action addresses  
- `action_type`: Process change, investigation, resource allocation, etc.  
- `stakeholder_ids`: Who would need to be involved  
- `stakeholder_types`: Types of stakeholders  
- `expected_impact`: What outcome is anticipated  
- `priority`: Importance/urgency level  
- `effort_estimation`: Rough assessment of implementation difficulty  
- `status`: Suggested, reviewed, implemented, etc.  
- `requires_approval_from`: ID of entity that would approve

**Relationships:**

- Addresses specific Insights  
- Involves Stakeholders  
- Targets specific entities (Units, Capabilities, etc.)  
- May depend on other Potential Actions

## System Entities

### Agent

Agents represent the autonomous components of the Conceptor system.

**Attributes:**

- `id`: Unique identifier  
- `name`: Agent identifier  
- `purpose`: Primary function  
- `domain`: Knowledge/responsibility area  
- `access_pattern`: What entity types and instances this agent can access  
- `question_generation_capability`: Types of questions it can formulate  
- `insight_generation_capability`: Types of insights it can produce  
- `action_recommendation_capability`: Types of actions it can suggest  
- `status`: Active, inactive, in development

**Relationships:**

- Generates Questions  
- Produces Insights  
- Suggests Potential Actions  
- Has access to specific entity domains

### Entity Change Log

Tracks significant changes to entities for historical analysis.

**Attributes:**

- `id`: Unique identifier  
- `entity_id`: ID of the changed entity  
- `entity_type`: Type of the changed entity  
- `change_type`: Creation, modification, status change, etc.  
- `change_timestamp`: When the change occurred  
- `previous_state`: JSON representation of prior state  
- `new_state`: JSON representation of new state  
- `change_agent`: What caused the change (user or agent)  
- `related_insight_id`: If change was prompted by an insight

**Relationships:**

- References changed entity  
- May link to prompting Insight  
- Part of organizational change tracking

## Data Relationships Diagram

\[User\] \--occupies--\> \[Unit\] \--implements--\> \[Capability\]

  |                   |                         |

  |                   |                         |

  v                   v                         v

\[Answer\] \<--references-- \[Question\] \---references---\>

  |                        |

  |                        |

  v                        |

\[Insight\] \<------supports--+

  |

  |

  v

\[Potential Action\]

## Insight Types

The Insight entity supports various types of analytical results, including:

1. **Volunteered Information Insights**:  
     
   - Identify information users mention unprompted  
   - Reveal what users consider important enough to volunteer  
   - Help discover priorities and concerns not directly questioned

   

2. **Pattern Recognition Insights**:  
     
   - Identify common themes across multiple answers  
   - Discover organizational patterns mentioned by different users  
   - Highlight consistency or inconsistency in understanding

   

3. **Sentiment Analysis Insights**:  
     
   - Capture emotional context around topics and entities  
   - Identify areas of frustration, satisfaction, or concern  
   - Reveal how users feel about processes, initiatives, etc.

   

4. **Contradiction Insights**:  
     
   - Highlight conflicting answers about the same subject  
   - Identify areas requiring clarification or resolution  
   - Support reconciliation of different perspectives

   

5. **Capability Insights**:  
     
   - Discover formal and informal capabilities  
   - Identify capability gaps or redundancies  
   - Map capability implementations across units

   

6. **Relationship Insights**:  
     
   - Reveal informal relationships not in formal structures  
   - Identify key collaborations and dependencies  
   - Discover communication patterns and bottlenecks

## Key System Principles

1. **Epistemological Chain**:  
     
   - Questions are designed to elicit specific knowledge  
   - Answers represent subjective perspectives, not claimed as truth  
   - Insights derive patterns and interpretations from multiple answers  
   - Potential Actions suggest responses to insights

   

2. **Knowledge Freshness**:  
     
   - All entities have appropriate staleness factors  
   - System automatically identifies stale knowledge  
   - Questions can be re-asked to refresh important areas  
   - Insights are regenerated when supporting answers change

   

3. **Contradiction Management**:  
     
   - Contradictory answers can coexist in the system  
   - Insights can highlight contradictions for resolution  
   - Resolution can occur through additional questions or management input  
   - Answers can be superseded without deletion

   

4. **Organic Discovery**:  
     
   - System emphasizes discovering capabilities rather than imposing frameworks  
   - Both formal and informal structures are captured  
   - Actual work patterns may differ from documented processes  
   - Cross-validation occurs through multiple information sources

   

5. **Hard/Soft Data Separation**:  
     
   - Hard data (Questions, Answers) captures only factual exchanges  
   - Soft data (Insights, Potential Actions) contains interpretations and analyses  
   - LLM agents operate primarily at the soft data layer  
   - Clear lineage maintained between insights and supporting hard data

   

6. **Multi-Level Analysis**:  
     
   - Information is collected at individual level  
   - Insights can be generated at any organizational level  
   - Patterns can emerge bottom-up from individual responses  
   - Top-down hypotheses can be verified through targeted questions

   

7. **Multi-Insight Generation**:  
     
   - A single answer can spawn multiple insights of different types  
   - Different agents may analyze the same data for different patterns  
   - Insights can combine and synthesize information from multiple answers  
   - Each insight maintains clear provenance to its source data
