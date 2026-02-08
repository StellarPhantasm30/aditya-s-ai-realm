export interface ProjectDocumentation {
  overview: {
    problem: string;
    role: string;
    techStack: string[];
    scale: string;
    outcome: string;
  };
  architecture: {
    diagram?: string;
    designDecisions: string;
    alternatives: string;
    edgeCases: string;
  };
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

export const projectDocumentation: Record<string, ProjectDocumentation> = {
  "Validate.AI": {
    overview: {
      problem:
        "Organizations lacked centralized control over LLM usage across teams, leading to compliance risks, cost overruns, and inconsistent AI experiences. Teams were making direct API calls without governance, rate limiting, or observability.",
      role: "Lead architect responsible for the core routing engine, RBAC implementation, and integration with observability platforms. Collaborated with security and platform teams to define compliance requirements.",
      techStack: ["Python", "FastAPI", "LiteLLM", "Langfuse", "Redis", "PostgreSQL"],
      scale:
        "Processing 100% of organizational LLM traffic (~50K+ requests/day) with sub-100ms routing overhead. Designed for horizontal scaling with Redis-backed session management.",
      outcome:
        "Enabled organization-wide LLM governance, reduced API costs through intelligent routing and caching, achieved full compliance with internal AI policies, and provided real-time observability for all AI operations.",
    },
    architecture: {
      diagram: `flowchart TB
    subgraph Clients["Client Applications"]
        A1[Web App]
        A2[Mobile App]
        A3[Internal Tools]
    end
    
    subgraph Gateway["Validate.AI Platform"]
        B[API Gateway]
        C[Auth & RBAC]
        D[LLM Router]
        E[Cache Layer]
        F[Rate Limiter]
    end
    
    subgraph Providers["LLM Providers"]
        G1[OpenAI]
        G2[Anthropic]
        G3[Azure OpenAI]
        G4[Internal Models]
    end
    
    subgraph Observability["Monitoring"]
        H[Langfuse]
        I[Metrics Dashboard]
    end
    
    A1 --> B
    A2 --> B
    A3 --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G1
    F --> G2
    F --> G3
    F --> G4
    D --> H
    H --> I`,
      designDecisions: `
### Key Architectural Decisions

**FastAPI + LiteLLM Core**: Chose FastAPI for its async-first design enabling high throughput with minimal overhead. LiteLLM provides a unified interface to 100+ LLM providers, eliminating the need for custom integrations.

**Redis-backed Caching**: Implemented semantic caching with configurable TTL. Similar prompts (using embedding similarity) can return cached responses, reducing costs and latency.

**Plugin Architecture**: Built extensible middleware system allowing teams to inject custom pre/post-processing logic (PII redaction, prompt enhancement, response filtering) without modifying core routing logic.

**Langfuse Integration**: Native integration provides token-level cost tracking, latency monitoring, and prompt versioning without additional instrumentation.`,
      alternatives: `
### Considered Alternatives

**Kong/AWS API Gateway**: Traditional API gateways lack LLM-specific features like token counting, streaming support, and model-aware routing. Would require extensive custom plugins.

**Direct Provider SDKs**: Evaluated having teams use provider SDKs directly with shared configuration. Rejected due to lack of centralized control and observability.

**LangServe**: Considered for its LangChain integration but chose custom solution for lower overhead and provider-agnostic design.`,
      edgeCases: `
### Edge Cases Handled

- **Model Failover**: Automatic fallback chain when primary provider is unavailable or rate-limited
- **Token Budget Enforcement**: Per-user/team token budgets with soft and hard limits
- **Streaming Response Handling**: Proper SSE handling with mid-stream error recovery
- **Long-running Requests**: Timeout management with graceful degradation
- **Prompt Size Limits**: Dynamic model selection based on context length requirements`,
    },
  },
  "Agentic RAG System": {
    overview: {
      problem:
        "Manual test case creation for 900+ APIs was time-consuming, inconsistent, and couldn't keep pace with rapid development cycles. Teams needed automated, intelligent test generation that understood API semantics.",
      role: "Full-stack architect designing the agentic workflow, RAG pipeline, and validation framework. Led integration with existing CI/CD pipelines and API documentation systems.",
      techStack: ["LangGraph", "CrewAI", "Python", "FastAPI", "Pinecone", "AWS Lambda"],
      scale:
        "Generating test suites for 900+ API endpoints with multi-agent orchestration. Processing thousands of API specifications and historical test data.",
      outcome:
        "Reduced test creation time by 80%, improved test coverage consistency, and enabled automatic test regeneration when APIs change.",
    },
    architecture: {
      diagram: `flowchart LR
    subgraph Input["Data Sources"]
        A1[OpenAPI Specs]
        A2[Historical Tests]
        A3[API Docs]
    end
    
    subgraph RAG["RAG Pipeline"]
        B1[Document Processor]
        B2[Embedding Engine]
        B3[Vector Store]
    end
    
    subgraph Agents["Agent Crew"]
        C1[Analyst Agent]
        C2[Generator Agent]
        C3[Validator Agent]
        C4[Optimizer Agent]
    end
    
    subgraph Output["Results"]
        D1[Test Suites]
        D2[Coverage Report]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> C4
    C4 --> D1
    C4 --> D2`,
      designDecisions: `
### Key Architectural Decisions

**LangGraph for Orchestration**: Chose LangGraph for its state machine approach to agent workflows. Enables complex decision trees with rollback capabilities.

**CrewAI Agent Framework**: Multi-agent design with specialized roles - Analyst (understands API context), Generator (creates tests), Validator (runs tests), Optimizer (improves coverage).

**Pinecone Vector Store**: Selected for its managed infrastructure and hybrid search capabilities, combining semantic and keyword matching for API retrieval.`,
      alternatives: `
### Considered Alternatives

**Single Agent Approach**: Tested monolithic agent but found specialized agents produced higher quality outputs with better debuggability.

**AutoGen Framework**: Evaluated Microsoft's AutoGen but preferred LangGraph's explicit state management for production reliability.`,
      edgeCases: `
### Edge Cases Handled

- **Complex API Dependencies**: Graph-based test ordering for dependent endpoints
- **Authentication Flows**: Specialized handling for OAuth, API keys, and session-based auth
- **Rate Limit Aware Testing**: Intelligent test scheduling to avoid provider limits`,
    },
  },
  "GenAI Chatbot": {
    overview: {
      problem:
        "Enterprise needed a production-ready conversational AI that maintained brand voice, handled domain-specific queries accurately, and could be safely deployed with proper guardrails.",
      role: "ML Engineer responsible for fine-tuning pipelines, guardrail implementation, and evaluation framework design. Worked with product teams to define conversation quality metrics.",
      techStack: ["LLM Fine-tuning", "PEFT", "QLoRA", "TensorFlow", "Hugging Face", "LangChain"],
      scale:
        "Fine-tuned on 50K+ domain-specific conversation pairs. Serving thousands of daily conversations with sub-second response times.",
      outcome:
        "Achieved 40% improvement in domain accuracy over base models, reduced hallucination rate by 60%, and maintained consistent brand voice across interactions.",
    },
    architecture: {
      diagram: `flowchart TB
    subgraph Training["Fine-tuning Pipeline"]
        A[Dataset Curation]
        B[PEFT/QLoRA Training]
        C[Evaluation Suite]
        D[Model Registry]
    end
    
    subgraph Inference["Production System"]
        E[Load Balancer]
        F[Input Guardrails]
        G[Fine-tuned LLM]
        H[Output Guardrails]
        I[Response Cache]
    end
    
    subgraph Monitoring["Quality Assurance"]
        J[Conversation Logs]
        K[Quality Metrics]
        L[Feedback Loop]
    end
    
    A --> B
    B --> C
    C --> D
    D --> G
    E --> F
    F --> G
    G --> H
    H --> I
    G --> J
    J --> K
    K --> L
    L --> A`,
      designDecisions: `
### Key Architectural Decisions

**QLoRA Fine-tuning**: Chose QLoRA for efficient fine-tuning on limited GPU resources while maintaining quality. Enables rapid iteration on training data.

**Dual Guardrail System**: Input guardrails for prompt injection detection, output guardrails for hallucination and policy violation detection.

**Feedback Loop Integration**: Continuous improvement pipeline that routes low-confidence responses for human review and retraining.`,
      alternatives: `
### Considered Alternatives

**Full Fine-tuning**: Rejected due to computational cost and overfitting risks on limited domain data.

**Prompt Engineering Only**: Tested extensively but couldn't achieve required domain accuracy without fine-tuning.`,
      edgeCases: `
### Edge Cases Handled

- **Prompt Injection Attempts**: Multi-layer detection and safe response generation
- **Out-of-Domain Queries**: Graceful handoff to human agents with context preservation
- **Conversation Memory Limits**: Intelligent summarization for long conversations`,
    },
  },
  "AIOps Agents": {
    overview: {
      problem:
        "IT operations teams were overwhelmed with alerts and manual incident response. Mean time to resolution (MTTR) was high, and recurring issues consumed significant engineering time.",
      role: "Platform architect designing autonomous agent workflows, integration with monitoring systems, and self-healing automation framework.",
      techStack: ["LangChain", "Agents", "Azure", "Microservices", "Kubernetes", "Prometheus"],
      scale:
        "Monitoring 500+ microservices, processing thousands of alerts daily, and automating resolution for common incident patterns.",
      outcome:
        "Reduced MTTR by 65%, automated resolution for 40% of recurring incidents, and freed up operations team for strategic work.",
    },
    architecture: {
      diagram: `flowchart TB
    subgraph Monitoring["Data Sources"]
        A1[Prometheus]
        A2[Log Aggregator]
        A3[APM Tools]
    end
    
    subgraph Intelligence["AI Layer"]
        B[Alert Correlator]
        C[Root Cause Agent]
        D[Remediation Agent]
        E[Knowledge Base]
    end
    
    subgraph Actions["Automation"]
        F[Runbook Executor]
        G[K8s Controller]
        H[Notification System]
    end
    
    A1 --> B
    A2 --> B
    A3 --> B
    B --> C
    C --> E
    E --> D
    D --> F
    D --> G
    D --> H`,
      designDecisions: `
### Key Architectural Decisions

**Agent-based Architecture**: Specialized agents for different phases - correlation, root cause analysis, and remediation. Enables independent scaling and updates.

**Knowledge Base Integration**: RAG-powered knowledge base of past incidents, runbooks, and resolution patterns for informed decision-making.

**Human-in-the-Loop**: Configurable confidence thresholds determine when to auto-remediate vs. escalate to humans.`,
      alternatives: `
### Considered Alternatives

**Rule-based Automation**: Traditional approach couldn't handle novel incident patterns or learn from past resolutions.

**Single AI Model**: Monolithic approach lacked the specialization needed for different operational tasks.`,
      edgeCases: `
### Edge Cases Handled

- **Cascading Failures**: Detection and prevention of remediation actions that could worsen incidents
- **False Positive Management**: Confidence scoring and feedback loops to reduce alert fatigue
- **Blast Radius Control**: Sandboxed remediation with rollback capabilities`,
    },
  },
  "Azure LLM Deployment": {
    overview: {
      problem:
        "Teams wanted to use open-source LLMs but lacked infrastructure expertise for production deployment. Cloud costs were unpredictable and scaling was manual.",
      role: "DevOps/MLOps engineer designing deployment pipelines, infrastructure as code, and cost optimization strategies for LLM inference.",
      techStack: ["Azure ML", "Docker", "Kubernetes", "MLOps", "Terraform", "GitHub Actions"],
      scale:
        "Supporting multiple LLM deployments (7B-70B parameter models) with auto-scaling based on demand and cost-aware instance selection.",
      outcome:
        "Reduced deployment time from days to hours, achieved 50% cost savings through optimization, and enabled self-service LLM deployment for teams.",
    },
    architecture: {
      diagram: `flowchart LR
    subgraph Source["Model Source"]
        A1[Hugging Face]
        A2[Azure Model Catalog]
    end
    
    subgraph Pipeline["CI/CD Pipeline"]
        B1[Model Validation]
        B2[Container Build]
        B3[Performance Tests]
    end
    
    subgraph Deploy["Azure Infrastructure"]
        C1[Container Registry]
        C2[AKS Cluster]
        C3[Auto-scaler]
        C4[Load Balancer]
    end
    
    subgraph Optimize["Cost Management"]
        D1[Spot Instances]
        D2[Usage Analytics]
        D3[Right-sizing]
    end
    
    A1 --> B1
    A2 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> C4
    C2 --> D1
    D1 --> D2
    D2 --> D3`,
      designDecisions: `
### Key Architectural Decisions

**Kubernetes-native Deployment**: Leveraged AKS for container orchestration with custom operators for LLM-specific scaling (based on queue depth and token throughput).

**Multi-tier Instance Strategy**: Combined reserved instances for baseline load with spot instances for burst capacity, significantly reducing costs.

**Model-agnostic Pipeline**: Standardized deployment templates that work across model sizes and architectures.`,
      alternatives: `
### Considered Alternatives

**Azure ML Managed Endpoints**: Simpler but less cost-efficient and flexible for custom optimization needs.

**Serverless Inference**: Evaluated but cold start latency was unacceptable for interactive use cases.`,
      edgeCases: `
### Edge Cases Handled

- **Spot Instance Interruption**: Graceful request draining and fast failover to on-demand instances
- **Model Hot-swapping**: Zero-downtime model updates with traffic shifting
- **GPU Memory Management**: Efficient batching and memory cleanup for long-running inference servers`,
    },
  },
  "Full-stack GenAI App": {
    overview: {
      problem:
        "Building production GenAI applications required integrating multiple complex components - streaming responses, real-time updates, secure API handling, and scalable infrastructure.",
      role: "Full-stack engineer architecting the complete application stack, from React frontend to containerized backend services with real-time capabilities.",
      techStack: ["Docker", "FastAPI", "React", "Redis", "Kafka", "PostgreSQL"],
      scale:
        "Supporting concurrent users with real-time streaming, message queuing for async processing, and containerized deployment for consistent environments.",
      outcome:
        "Created reusable architecture template for GenAI applications, reduced development time for new projects by 60%, and established best practices for the team.",
    },
    architecture: {
      diagram: `flowchart TB
    subgraph Frontend["React Frontend"]
        A1[Chat UI]
        A2[WebSocket Client]
        A3[State Management]
    end
    
    subgraph Backend["FastAPI Services"]
        B1[API Gateway]
        B2[Auth Service]
        B3[Chat Service]
        B4[LLM Service]
    end
    
    subgraph Infra["Infrastructure"]
        C1[Redis Cache]
        C2[Kafka Queue]
        C3[PostgreSQL]
        C4[S3 Storage]
    end
    
    A1 --> A2
    A2 --> B1
    A3 --> A1
    B1 --> B2
    B1 --> B3
    B3 --> B4
    B3 --> C1
    B4 --> C2
    B3 --> C3
    B3 --> C4`,
      designDecisions: `
### Key Architectural Decisions

**Event-driven Architecture**: Kafka for async processing enables handling long-running LLM calls without blocking user interactions.

**WebSocket Streaming**: Real-time token streaming from LLM to frontend for responsive chat experience.

**Containerized Microservices**: Docker Compose for local development parity with production Kubernetes deployment.`,
      alternatives: `
### Considered Alternatives

**Monolithic Backend**: Simpler initially but would limit independent scaling of LLM-heavy services.

**REST-only API**: Polling approach for responses was less responsive and more resource-intensive than WebSocket streaming.`,
      edgeCases: `
### Edge Cases Handled

- **Connection Recovery**: Automatic WebSocket reconnection with message replay from Kafka
- **Long Response Handling**: Chunked streaming with heartbeats to prevent connection timeouts
- **Rate Limiting**: Per-user rate limiting with Redis-backed token buckets`,
    },
  },
};
