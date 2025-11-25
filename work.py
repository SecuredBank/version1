import numpy as np
import matplotlib.pyplot as plt

# given values
Ym = 5
w = 100 * np.pi
angle = np.pi / 6

# simulate signals
t = np.linspace(0, 0.02, 10000)  # 20 ms
y1 = Ym * np.sin(w * t)
y2 = Ym * np.sin(w * t + angle)
 
# plot
plt.figure(figsize=(8,4))
plt.plot(t, y1, label="y1 = Ym sin(wt)")
plt.plot(t, y2, label="y2 = Ym sin(wt + angle)")
plt.legend()
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.title("Phase Shift Simulation")
plt.grid(True)
plt.show()







