import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createExpense } from "../services/api";
import "../styles/TripDetail.css";

function TripDetail() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [paidByMemberId, setPaidByMemberId] = useState("");
  const [participantIds, setParticipantIds] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrip();
    loadMembers();
    loadExpenses();
  }, [tripId]);

  async function loadTrip() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/trips/${tripId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }

      const data = await response.json();
      setTrip(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMembers() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/trips/${tripId}/members`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadExpenses() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/trips/${tripId}/expenses`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function addMember(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/trips/${tripId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: memberName,
            email: memberEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add member");
      }

      const newMember = await response.json();

      setMembers([...members, newMember]);

      setMemberName("");
      setMemberEmail("");
    } catch (error) {
      console.error(error);
      alert("Failed to add member.");
    }
  }

  async function handleCreateExpense(event) {
    event.preventDefault();

    try {
      const expense = {
        description,
        amount: Number(amount),
        date: expenseDate,
        paidByMemberId: Number(paidByMemberId),
        participantIds: participantIds.map(Number),
      };

      const newExpense = await createExpense(tripId, expense);

      setExpenses([...expenses, newExpense]);

      setDescription("");
      setAmount("");
      setExpenseDate("");
      setPaidByMemberId("");
      setParticipantIds([]);
    } catch (error) {
      console.error(error);
      alert("Failed to create expense.");
    }
  }

  function handleParticipantChange(memberId) {
    if (participantIds.includes(memberId)) {
      setParticipantIds(
        participantIds.filter((id) => id !== memberId)
      );
    } else {
      setParticipantIds([
        ...participantIds,
        memberId,
      ]);
    }
  }

  function getMemberName(memberId) {
    const member = members.find(
      (member) => member.id === memberId
    );

    return member ? member.name : "Unknown";
  }

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (!trip) {
    return <p className="loading">Trip not found.</p>;
  }

  return (
    <div className="trip-detail">

      {/* Back */}
      <Link to="/" className="back-link">
        ← Back to Trips
      </Link>

      {/* Trip Header */}
      <div className="trip-header">
        <div>
          <h1>{trip.name}</h1>

          <div className="trip-info">
            <span>📍 {trip.destination}</span>

            <span>
              📅 {trip.startDate} ~ {trip.endDate}
            </span>

            <span>
              💰 Budget: ${trip.budget}
            </span>
          </div>
        </div>
      </div>

      {/* Members */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2>👥 Members</h2>
            <p className="section-description">
              People joining this trip
            </p>
          </div>
        </div>

        {members.length === 0 ? (
          <p className="empty-message">
            No members yet.
          </p>
        ) : (
          <div className="member-list">
            {members.map((member) => (
              <div
                className="member-card"
                key={member.id}
              >
                <div className="member-avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="member-name">
                    {member.name}
                  </div>

                  <div className="member-email">
                    {member.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Member */}
        <form
          className="form"
          onSubmit={addMember}
        >
          <h3>Add Member</h3>

          <div className="form-row">

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="e.g. Alice"
                value={memberName}
                onChange={(event) =>
                  setMemberName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="e.g. alice@gmail.com"
                value={memberEmail}
                onChange={(event) =>
                  setMemberEmail(event.target.value)
                }
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="primary-button"
          >
            ＋ Add Member
          </button>
        </form>

      </section>

      {/* Expenses */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2>💰 Expenses</h2>

            <p className="section-description">
              Track and split your trip expenses
            </p>
          </div>
        </div>

        {/* Add Expense */}
        <form
          className="form"
          onSubmit={handleCreateExpense}
        >
          <h3>Add Expense</h3>

          <div className="form-row">

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                placeholder="e.g. Dinner"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                placeholder="e.g. 2000"
                min="0"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                value={expenseDate}
                onChange={(event) =>
                  setExpenseDate(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Paid By</label>

              <select
                value={paidByMemberId}
                onChange={(event) =>
                  setPaidByMemberId(event.target.value)
                }
                required
              >
                <option value="">
                  Select member
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="form-group">
            <label>Split Between</label>

            <div className="participant-list">

              {members.map((member) => (
                <label
                  className="participant"
                  key={member.id}
                >
                  <input
                    type="checkbox"
                    checked={participantIds.includes(
                      member.id
                    )}
                    onChange={() =>
                      handleParticipantChange(
                        member.id
                      )
                    }
                  />

                  <span>{member.name}</span>
                </label>
              ))}

            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
          >
            ＋ Add Expense
          </button>

        </form>

        {/* Expense List */}
        <div className="expense-list">

          {expenses.length === 0 ? (
            <p className="empty-message">
              No expenses yet.
            </p>
          ) : (
            expenses.map((expense) => (
              <div
                className="expense-card"
                key={expense.id}
              >
                <div>
                  <div className="expense-description">
                    {expense.description}
                  </div>

                  <div className="expense-meta">
                    {expense.date}
                    {" · "}
                    Paid by{expense.paidBy?.name}
                  </div>
                </div>

                <div className="expense-amount">
                  ${expense.amount}
                </div>
              </div>
            ))
          )}

        </div>

      </section>

      {/* Settlement */}
      <section className="section">

        <div className="section-header">
          <div>
            <h2>💸 Settlement</h2>

            <p className="section-description">
              See who owes whom
            </p>
          </div>
        </div>

        <div className="settlement-empty">
          <div className="settlement-icon">
            💸
          </div>

          <p>
            Settlement will appear here.
          </p>
        </div>

      </section>

    </div>
  );
}

export default TripDetail;