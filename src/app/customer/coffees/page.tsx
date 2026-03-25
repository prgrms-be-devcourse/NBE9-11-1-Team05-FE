"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 


const COFFEE_IMAGE_MAP: Record<string, string> = {
  "에티오피아": "/images/Ethiopia.jpg",
  "콜롬비아": "/images/Colombia.jpg",
  "브라질": "/images/Brazil.jpg",
  "과테말라": "/images/Guatemala.jpg",
};

const getCoffeeImage = (name: string) => {
  for (const key in COFFEE_IMAGE_MAP) {
    if (name.includes(key)) return COFFEE_IMAGE_MAP[key];
  }
  return "/images/default-coffee.png";
};

export default function CoffeeOrderPage() {
  const router = useRouter(); 

  const [products, setProducts] = useState<any[]>([]); 
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const [toastMsg, setToastMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderDone, setIsOrderDone] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ email: '', address: '', zip: '', orderId: '', totalAmount: '' });

    const fetchAllCoffees = async () => {
      try {
        const res = await fetch('http://localhost:8080/coffees');
        const json = await res.json();

        if (res.ok && json.data) {
          const formattedData = json.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            desc: '',
            price: item.price,
            stock: item.quantity 
          }));
          setProducts(formattedData);
        }
      } catch (e) {
        showToast('서버와 연결할 수 없습니다.');
      }
    };

    useEffect(() => {
    fetchAllCoffees();
  }, []);

  const toggleDesc = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/coffees/detail/${id}`);
      const json = await res.json();

      if (res.ok && json.data) {
        setProducts(prev => prev.map(p => p.id === id ? {
          ...p,
          desc: json.data.description,
          price: json.data.price,
          stock: json.data.quantity
        } : p));
        setExpandedId(id);
      } else {
        showToast(json.message || '상세 정보를 불러오지 못했습니다.');
      }
    } catch (e) {
      showToast('서버와 연결할 수 없습니다.');
      setExpandedId(id); 
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const addToCart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const p = products.find(x => x.id === id);
    if (!p) return;
    const current = cart[id] || 0;
    if (current >= p.stock) {
      showToast(`${p.stock}개 보다 적게 주문해 주세요.`);
      return;
    }
    setCart({ ...cart, [id]: current + 1 });
    showToast(`${p.name}이(가) 추가되었습니다.`);
  };

  const changeQty = (id: number, delta: number) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const current = cart[id] || 0;
    
    if (delta > 0 && current >= p.stock) {
      showToast(`${p.stock}개 보다 적게 주문해 주세요.`);
      return;
    }
    
    const newQty = current + delta;
    if (newQty <= 0) {
      const newCart = { ...cart };
      delete newCart[id];
      setCart(newCart);
    } else {
      setCart({ ...cart, [id]: newQty });
    }
  };

  const removeItem = (id: number) => {
    const newCart = { ...cart };
    delete newCart[id];
    setCart(newCart);
  };

  const cartItems = Object.keys(cart).map(Number).map(id => {
    const p = products.find(x => x.id === id)!;
    return { ...p, qty: cart[id], subtotal: p.price * cart[id] };
  });
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    setOrderInfo({ ...orderInfo, email: '', address: '', zip: '' });
    setIsOrderDone(false);
    setIsModalOpen(true);
  };

  const submitOrder = async () => {
    if (!orderInfo.email || !orderInfo.address || !orderInfo.zip) {
      showToast('모든 고객정보를 입력해주세요.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderInfo.email)) {
      showToast('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    const addressRegex = /^[가-힣]+시\s+[가-힣]+구\s+[가-힣0-9]+로\s+\d+$/;
    if (!addressRegex.test(orderInfo.address.trim())) {
      showToast('주소는 "서울시 강남구 테헤란로 123" 형식으로 입력해주세요.');
      return;
    }
    if (orderInfo.zip.length !== 5) {
      showToast('우편번호는 5자리 숫자로 입력해주세요.');
      return;
    }

    const orderPayload = {
      email: orderInfo.email,
      address: orderInfo.address,
      zipCode: orderInfo.zip,
      coffeeOrderList: cartItems.map(item => ({
        id: item.id,
        quantity: item.qty
      }))
    };

    try {
      const res = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (res.ok) {
        setOrderInfo({ 
          ...orderInfo, 
          orderId: json.data?.orderId || '발급완료', 
          totalAmount: totalAmount.toLocaleString() + ' 원' 
        });
        
        await fetchAllCoffees();
        
        setIsOrderDone(true);
        setCart({}); 
        setTimeout(() => {
          setIsModalOpen(false);
          setIsOrderDone(false); 
        }, 5000);

      } else {
        showToast(json.message || '주문 처리에 실패했습니다.');
      }
    } catch (e) {
      showToast('서버 통신 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* 탭 네비게이션 */}
      <nav className="top-nav">
        <span style={{ 
          marginRight: '40px', 
          fontFamily: "'Pretendard', serif", 
          fontSize: '1.3rem', 
          fontWeight: 700, 
          paddingBottom: '12px',
          color: 'var(--text-dark)'
        }}>
          Grid&Circle
        </span>
        <a className="nav-tab active" href="#">상품 목록</a>
        <a className="nav-tab" href="/customer/orders/search">주문 조회</a>
      </nav>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <h1 style={{ marginTop: '48px' }}>상품 목록</h1>
        <div style={{ 
              marginBottom: '20px', 
              color: '#666', 
              fontSize: '14px', 
              fontWeight: '500', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <span style={{ fontSize: '16px' }}>🚚</span> 당일 오후 2시 주문건까지 당일 배송합니다.
            </div>
        <div className="layout">
          
          <div className="product-list">
            {products.map(p => (
              <div key={p.id} className={`product-card ${expandedId === p.id ? 'expanded' : ''}`} onClick={() => toggleDesc(p.id)}>
                <div className="product-img">
                  <img 
                    src={getCoffeeImage(p.name)} 
                    alt={p.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/images/default-coffee.png'; }}
                  />
                </div>
                <div className="product-info">
                  <div className="product-name-row">
                    <span className="product-name">{p.name}</span>
                    <span className="expand-indicator">▼</span>
                  </div>
                  <div className="product-desc">{p.desc}</div>
                 <div className="product-stock" style={{ color: p.stock === 0 ? 'red' : 'inherit' }}>
                    {p.stock === 0 ? '품절' : `재고: ${p.stock}개 남음`}
                  </div>
                </div>
                <div className="product-price">{p.price.toLocaleString()}원</div>
                <button 
                  className="add-btn" 
                  onClick={(e) => addToCart(e, p.id)} 
                  title="장바구니에 추가"
                  disabled={p.stock === 0}
                  style={{ 
                    backgroundColor: p.stock === 0 ? '#ccc' : undefined, 
                    cursor: p.stock === 0 ? 'not-allowed' : 'pointer' 
                  }}
                >
                  {p.stock === 0 ? '✕' : '+'}
                </button>
              </div>
            ))}
          </div>

          <div className="summary">
            <h2>Summary</h2>
            <div className="summary-list">
              {cartItems.length === 0 ? (
                <div className="empty-cart">장바구니가 비어 있습니다.</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="summary-item-name">{item.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="summary-item-price">{item.subtotal.toLocaleString()} 원</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#888', padding: '0 4px' }}
                          title="삭제"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="summary-item-label">수량</div>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                    </div>
                    
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && <hr className="summary-divider" />}
            <div className="summary-total">
              <span className="summary-total-label">총 금액 :</span>
              <span className="summary-total-amount">{totalAmount.toLocaleString()} 원</span>
            </div>
            <button className="order-btn" onClick={placeOrder} disabled={cartItems.length === 0}>
              주문하기
            </button>
          </div>
        </div>
      </div>

      <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>

      {isModalOpen && (
        <div className="form-overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="form-doc">
            <button className="form-close" onClick={() => setIsModalOpen(false)}>✕</button>
            
            {!isOrderDone ? (
              <div id="formView">
                <div className="form-title">상품 주문서</div>
                <div className="form-grid">
                  <div className="form-section">
                    <span className="form-section-label">고객정보 입력</span>
                    <div className="form-field">
                      <label>이메일</label>
                      <input type="email" value={orderInfo.email} onChange={e => setOrderInfo({...orderInfo, email: e.target.value})} placeholder="example@email.com" />
                    </div>
                    <div className="form-field">
                      <label>상세주소</label>
                      <input type="text" value={orderInfo.address} onChange={e => setOrderInfo({...orderInfo, address: e.target.value})} placeholder="도로명 주소 입력" />
                    </div>
                    <div className="form-field">
                      <label>우편번호</label>
                      <input type="text" value={orderInfo.zip} onChange={e =>{
                          const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                          setOrderInfo({...orderInfo, zip: onlyNumbers});
                        }} placeholder="00000" maxLength={5} />
                    </div>
                  </div>

                  <div className="form-section">
                    <span className="form-section-label">주문 상품</span>
                    <span className="form-items-count">총 {cartItems.length}개</span>
                    <div className="form-item-list">
                      {cartItems.map(item => (
                        <div key={item.id} className="form-item">
                          <div className="form-item-info">
                            <div className="form-item-name">{item.name}</div>
                            <div className="form-item-qty">수량: {item.qty}개</div>
                          </div>
                          <div className="form-item-price">{item.subtotal.toLocaleString()}원</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-section form-payment">
                  <span className="form-section-label">결제 정보</span>
                  <div className="form-total-row">
                    <span className="form-total-label">총 결제금액 :</span>
                    <span className="form-total-amount">{totalAmount.toLocaleString()} 원</span>
                  </div>
                  <div className="form-pay-wrap">
                    <button className="form-pay-btn" onClick={submitOrder}>결제하기</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="done-view show">
                <div className="done-icon">☕</div>
                <h3>주문이 완료되었습니다!</h3>
                {new Date().getHours() >= 14 && (
                <div style={{ 
                  margin: '12px auto', 
                  color: '#d9534f',    
                  fontSize: '13px', 
                  fontWeight: 'bold',
                  backgroundColor: '#fff3f3',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'inline-block' 
                }}>
                  ⏰ 14시 이후 주문은 다음날 14시에 일괄 처리됩니다.
                </div>
              )}
                <p>
                  
                  이메일: <strong>{orderInfo.email}</strong><br/>
                  {/* 주문번호: <strong>{orderInfo.orderId}</strong><br/> */}
                  결제금액: <strong>{orderInfo.totalAmount}</strong>
                </p>
                
                <button className="done-close-btn" onClick={() => {
                    setIsModalOpen(false);
                    setIsOrderDone(false);
                  }}>계속 쇼핑 하기</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}