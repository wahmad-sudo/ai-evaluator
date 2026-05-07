/**
 * Jest unit tests for evaluator API client.
 * Run with: npx jest src/__tests__/evaluator.test.ts
 */
import { listRuns, listItems, listResponses, submitResponse, createRun, createItem } from "@/lib/api/evaluator";

const MOCK_RUN_ID = "run-abc-123";
const MOCK_ITEM_ID = "item-xyz-456";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockOk(body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => body,
  });
}

function mockError(status: number, text: string) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: async () => text,
  });
}

beforeEach(() => {
  mockFetch.mockClear();
  // Simulate a logged-in user token
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => (key === "token" ? "test-jwt-token" : null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

// ─── listRuns ────────────────────────────────────────────────────────────────

describe("listRuns", () => {
  it("calls /evaluator/runs and returns array", async () => {
    const runs = [{ id: MOCK_RUN_ID, name: "Daily", cadence: "daily", status: "active" }];
    mockOk(runs);
    const result = await listRuns();
    expect(result).toEqual(runs);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/evaluator/runs"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer test-jwt-token" }),
      }),
    );
  });

  it("appends org_id query param when provided", async () => {
    mockOk([]);
    await listRuns("org-999");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("org_id=org-999"),
      expect.anything(),
    );
  });

  it("throws on non-ok response", async () => {
    mockError(401, "Unauthorized");
    await expect(listRuns()).rejects.toThrow("401");
  });
});

// ─── listItems ───────────────────────────────────────────────────────────────

describe("listItems", () => {
  it("returns empty array for empty runId without fetching", async () => {
    const result = await listItems("");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls /evaluator/runs/{id}/items with auth", async () => {
    const items = [{ id: MOCK_ITEM_ID, run_id: MOCK_RUN_ID, title: "T1" }];
    mockOk(items);
    const result = await listItems(MOCK_RUN_ID);
    expect(result).toEqual(items);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/evaluator/runs/${MOCK_RUN_ID}/items`),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer test-jwt-token" }),
      }),
    );
  });
});

// ─── listResponses ────────────────────────────────────────────────────────────

describe("listResponses", () => {
  it("returns empty array for empty runId without fetching", async () => {
    const result = await listResponses("");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls /evaluator/runs/{id}/responses", async () => {
    const responses = [{ id: "r1", run_id: MOCK_RUN_ID, item_id: MOCK_ITEM_ID, score: 4 }];
    mockOk(responses);
    const result = await listResponses(MOCK_RUN_ID);
    expect(result).toEqual(responses);
  });
});

// ─── submitResponse ───────────────────────────────────────────────────────────

describe("submitResponse", () => {
  it("POSTs to /evaluator/responses with JSON body", async () => {
    const resp = { id: "r2", run_id: MOCK_RUN_ID, item_id: MOCK_ITEM_ID, score: 5 };
    mockOk(resp);
    const result = await submitResponse({
      run_id: MOCK_RUN_ID,
      item_id: MOCK_ITEM_ID,
      score: 5,
      evaluator_name: "tester",
    });
    expect(result).toEqual(resp);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/evaluator/responses");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.score).toBe(5);
    expect(body.item_id).toBe(MOCK_ITEM_ID);
  });
});

// ─── createRun ────────────────────────────────────────────────────────────────

describe("createRun", () => {
  it("POSTs to /evaluator/runs with correct body", async () => {
    const run = { id: MOCK_RUN_ID, name: "New Run", cadence: "weekly", status: "active" };
    mockOk(run);
    const result = await createRun({
      name: "New Run",
      cadence: "weekly",
      start_date: "2026-05-07",
      status: "active",
    });
    expect(result).toEqual(run);
    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.name).toBe("New Run");
  });
});

// ─── createItem ───────────────────────────────────────────────────────────────

describe("createItem", () => {
  it("POSTs to /evaluator/runs/{id}/items", async () => {
    const item = { id: MOCK_ITEM_ID, run_id: MOCK_RUN_ID, title: "Task A" };
    mockOk(item);
    const result = await createItem(MOCK_RUN_ID, { title: "Task A", priority: "high" });
    expect(result).toEqual(item);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain(`/evaluator/runs/${MOCK_RUN_ID}/items`);
    const body = JSON.parse(init.body);
    expect(body.task_status).toBe("pending");
    expect(body.priority).toBe("high");
  });
});
